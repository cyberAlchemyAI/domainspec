#!/usr/bin/env node
'use strict';
/*
 * Installer — makes the dispatch-governance hooks + the register-dispatch skill
 * GLOBAL for the current user, so they apply to every repo with no per-repo
 * wiring:
 *
 *   hooks (PreToolUse):
 *     - remind-register-dispatch  (on Agent)    -> reminds the agent to record
 *                                                  the dispatch via the skill
 *     - block-workflow            (on Workflow) -> denies the Workflow tool
 *     - enforce-append-only-dispatch
 *         (on Edit|MultiEdit|Write|NotebookEdit|Bash|PowerShell)
 *         -> denies direct edits to telemetry/agents/subagents-dispatch.yaml;
 *            the appender (append-dispatch.cjs) is the only write path
 *   skill (GLOBAL, ~/.claude/skills — portable infra):
 *     - register-dispatch -> writes one row per dispatch to
 *                            <repo>/telemetry/agents/subagents-dispatch.yaml
 *                            (agents = JSON column)
 *   chain skills (PROJECT, <repo>/.claude/skills — project-coupled, they
 *   reference this repo's constitution/vault):
 *     - domainspec-subagents-strategy (router), research, review, experiment
 *       (type skills), robot-talks (companion) -> synced FROM this bundle, so
 *       internal_tools is the single source of truth and .claude/skills is the
 *       generated copy. Edit the skill HERE, then re-run install to push it.
 *       Target repo = CLAUDE_PROJECT_DIR, else the current working directory.
 *
 * Idempotent and non-destructive: preserves existing ~/.claude/settings.json
 * keys/hooks. Registrations use REPLACE semantics — a re-run drops any stale
 * registration of our scripts (old matcher or event) and re-adds them from the
 * REGISTRATIONS table, so re-running syncs registrations, not just files.
 * Migrates away the retired log-subagent-dispatch hook.
 *
 * Harness note: this installer targets Claude Code (~/.claude/settings.json
 * hook protocol). The appender it ships (append-dispatch.cjs) is
 * harness-neutral — any agent harness that can run `node` can register rows;
 * only the hook wiring here is Claude-specific. Other harnesses would get
 * their own install target, not changes to the appender.
 *
 * Run:  node install.cjs            Uninstall:  node install.cjs --uninstall
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const home = os.homedir();
const claudeDir = path.join(home, '.claude');
const hooksDir = path.join(claudeDir, 'hooks');
const skillsDir = path.join(claudeDir, 'skills');
const settingsPath = path.join(claudeDir, 'settings.json');
const here = __dirname;

const HOOKS = ['remind-register-dispatch.cjs', 'block-workflow.cjs', 'enforce-append-only-dispatch.cjs'];
const SKILL = 'register-dispatch';
const SKILL_FILES = ['SKILL.md', 'append-dispatch.cjs'];
// Chain skills: project-coupled, installed into the TARGET repo's .claude/skills
// (not ~/.claude), with internal_tools/skills/<name>/ as the single source.
const CHAIN_SKILLS = ['domainspec-subagents-strategy', 'research', 'review', 'experiment', 'check-tension', 'robot-talks'];
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const projectSkillsDir = path.join(projectDir, '.claude', 'skills');
// Copy every file in a source skill dir to its destination dir (skills carry
// SKILL.md, occasionally a helper script); returns the count copied.
function installSkillDir(srcDir, dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, f);
    if (fs.statSync(src).isFile()) { fs.copyFileSync(src, path.join(dstDir, f)); n++; }
  }
  return n;
}
// `event` is the settings.json hook event array the entry belongs to
// (PreToolUse today; PostToolUse etc. become a table entry, not new code).
const REGISTRATIONS = [
  { event: 'PreToolUse', matcher: '^Agent$', script: 'remind-register-dispatch.cjs' },
  { event: 'PreToolUse', matcher: '^Workflow$', script: 'block-workflow.cjs' },
  { event: 'PreToolUse', matcher: '^(Edit|MultiEdit|Write|NotebookEdit|Bash|PowerShell)$', script: 'enforce-append-only-dispatch.cjs' },
];
// Scripts whose registrations/files should be removed on install (migration) and uninstall.
const RETIRED = ['log-subagent-dispatch.cjs'];

const uninstall = process.argv.includes('--uninstall');
const fwd = (p) => p.split(path.sep).join('/');

function loadSettings() {
  if (!fs.existsSync(settingsPath)) return {};
  try { return JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/^\uFEFF/, '') || '{}'); } // tolerate UTF-8 BOM
  catch (e) { console.error('Refusing to touch an unparseable settings.json:', e.message); process.exit(1); }
}
function saveSettings(s) {
  fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2) + '\n');
  console.log('updated', settingsPath);
}
// Drop any hook entry (in ANY event array) whose command references one of
// `names` — so a script moved between events, or re-registered with a new
// matcher, never leaves a stale entry behind.
function stripRegistrations(settings, names) {
  settings.hooks = settings.hooks || {};
  for (const event of Object.keys(settings.hooks)) {
    if (!Array.isArray(settings.hooks[event])) continue;
    settings.hooks[event] = settings.hooks[event].filter((e) =>
      !(e.hooks || []).some((h) =>
        typeof h.command === 'string' && names.some((n) => h.command.includes(n))));
  }
}

if (uninstall) {
  if (fs.existsSync(settingsPath)) {
    const settings = loadSettings();
    stripRegistrations(settings, HOOKS.concat(RETIRED));
    saveSettings(settings);
  }
  for (const s of HOOKS.concat(RETIRED)) {
    const p = path.join(hooksDir, s);
    if (fs.existsSync(p)) { fs.unlinkSync(p); console.log('removed', p); }
  }
  const sk = path.join(skillsDir, SKILL);
  if (fs.existsSync(sk)) { fs.rmSync(sk, { recursive: true, force: true }); console.log('removed', sk); }
  for (const name of CHAIN_SKILLS) {
    const p = path.join(projectSkillsDir, name);
    if (fs.existsSync(p)) { fs.rmSync(p, { recursive: true, force: true }); console.log('removed', p); }
  }
  console.log('\nUninstalled. Restart Claude Code sessions to pick up the change.');
  process.exit(0);
}

// 1. Hooks -> ~/.claude/hooks
fs.mkdirSync(hooksDir, { recursive: true });
for (const s of HOOKS) {
  fs.copyFileSync(path.join(here, 'hooks', s), path.join(hooksDir, s));
  console.log('installed hook', path.join(hooksDir, s));
}
// Remove retired hook files if present (migration from the old auto-logger).
for (const s of RETIRED) {
  const p = path.join(hooksDir, s);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log('removed retired hook', p); }
}

// 2. Skill -> ~/.claude/skills/register-dispatch
const skillDst = path.join(skillsDir, SKILL);
fs.mkdirSync(skillDst, { recursive: true });
for (const f of SKILL_FILES) {
  fs.copyFileSync(path.join(here, 'skills', SKILL, f), path.join(skillDst, f));
  console.log('installed skill file', path.join(skillDst, f));
}

// 2b. Chain skills -> <repo>/.claude/skills (project-coupled; this bundle is
// the single source). Synced verbatim, so the skills' `.claude/skills/...`
// cross-references are correct at the install target.
for (const name of CHAIN_SKILLS) {
  const src = path.join(here, 'skills', name);
  if (!fs.existsSync(src)) { console.warn('skip chain skill (missing in bundle):', name); continue; }
  const n = installSkillDir(src, path.join(projectSkillsDir, name));
  console.log('installed chain skill', path.join(projectSkillsDir, name), `(${n} file${n === 1 ? '' : 's'})`);
}

// 3. settings.json — migrate away retired regs, then REPLACE ours: strip any
// existing registration of our scripts (stale matcher/event) and re-add from
// the REGISTRATIONS table, so a re-run syncs registrations, not just files.
const settings = loadSettings();
settings.hooks = settings.hooks || {};
stripRegistrations(settings, RETIRED);
stripRegistrations(settings, REGISTRATIONS.map((r) => r.script));
for (const reg of REGISTRATIONS) {
  const event = reg.event || 'PreToolUse';
  settings.hooks[event] = settings.hooks[event] || [];
  const cmd = `node "${fwd(path.join(hooksDir, reg.script))}"`;
  settings.hooks[event].push({ matcher: reg.matcher, hooks: [{ type: 'command', command: cmd }] });
  console.log('registered:', event, reg.matcher, '->', reg.script);
}
saveSettings(settings);

console.log(
  '\nDone:\n' +
  '  GLOBAL (~/.claude, this user):\n' +
  '  • Agent dispatch -> reminder to run the register-dispatch skill\n' +
  '  • register-dispatch skill -> one row per dispatch in <repo>/telemetry/agents/subagents-dispatch.yaml\n' +
  '  • Workflow tool -> blocked (use Agent / research skill)\n' +
  '  • subagents-dispatch.yaml -> append-only (direct Edit/Write denied; append-dispatch.cjs is the only write path)\n' +
  `  PROJECT (${fwd(projectSkillsDir)}):\n` +
  '  • chain skills synced from this bundle: ' + CHAIN_SKILLS.join(', ') + '\n' +
  'Restart Claude Code sessions to pick up the change.');
