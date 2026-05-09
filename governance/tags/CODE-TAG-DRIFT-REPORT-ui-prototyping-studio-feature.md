# CODE-TAG-DRIFT-REPORT

- Mode: strict
- Input: governance/tags/code-tags-ui-prototyping-studio-feature.json
- Features root: docs/features/ui-prototyping-studio

## Summary

- Doc triples: 31
- Code triples: 8
- Docs only: 23
- Code only: 0
- Direction mismatch: 0
- Type mismatch: 0

## Docs Only (missing in code tags)

| From                                             | Edge         | To                                               | Source                                          |
| ------------------------------------------------ | ------------ | ------------------------------------------------ | ----------------------------------------------- |
| ui-prototyping-studio.InitializeSession          | enforces     | ui-prototyping-studio.VariantCount               | docs/features/ui-prototyping-studio/SPEC.md:190 |
| ui-prototyping-studio.SubmitPrompt               | transitions  | ui-prototyping-studio.StudioSessionState         | docs/features/ui-prototyping-studio/SPEC.md:191 |
| ui-prototyping-studio.GenerateVariants           | produces     | ui-prototyping-studio.PrototypeVariant           | docs/features/ui-prototyping-studio/SPEC.md:192 |
| ui-prototyping-studio.SelectOrCommitBaseline     | transitions  | ui-prototyping-studio.StudioSessionState         | docs/features/ui-prototyping-studio/SPEC.md:193 |
| ui-prototyping-studio.CaptureCommentEvent        | produces     | ui-prototyping-studio.CommentEvent               | docs/features/ui-prototyping-studio/SPEC.md:194 |
| ui-prototyping-studio.SynthesizeMutationBatch    | produces     | ui-prototyping-studio.MutationBatch              | docs/features/ui-prototyping-studio/SPEC.md:195 |
| ui-prototyping-studio.ApproveMutationBatch       | transitions  | ui-prototyping-studio.MutationBatchStatus        | docs/features/ui-prototyping-studio/SPEC.md:196 |
| ui-prototyping-studio.ApplyApprovedBatch         | produces     | ui-prototyping-studio.RevisionManifestEntry      | docs/features/ui-prototyping-studio/SPEC.md:197 |
| ui-prototyping-studio.ExportDesignHandoff        | exposes      | ui-prototyping-studio.GetHandoffBundle           | docs/features/ui-prototyping-studio/SPEC.md:198 |
| ui-prototyping-studio.GetDraftMutationBatch      | queries      | ui-prototyping-studio.MutationBatch              | docs/features/ui-prototyping-studio/SPEC.md:201 |
| ui-prototyping-studio.ListRevisionManifest       | queries      | ui-prototyping-studio.RevisionManifestEntry      | docs/features/ui-prototyping-studio/SPEC.md:202 |
| ui-prototyping-studio.GetHandoffBundle           | queries      | ui-prototyping-studio.RevisionManifestEntry      | docs/features/ui-prototyping-studio/SPEC.md:203 |
| ui-prototyping-studio.UIPrototypingStudioAPI     | exposes      | ui-prototyping-studio.ApplyApprovedBatch         | docs/features/ui-prototyping-studio/SPEC.md:210 |
| ui-prototyping-studio.StudioOrchestrationModule  | exposes      | ui-prototyping-studio.MVPStudioIterationWorkflow | docs/features/ui-prototyping-studio/SPEC.md:211 |
| ui-prototyping-studio.NewspaperContractAdapter   | maps         | ui-prototyping-studio.CommentEvent               | docs/features/ui-prototyping-studio/SPEC.md:212 |
| ui-prototyping-studio.NewspaperContractAdapter   | maps         | ui-prototyping-studio.MutationBatch              | docs/features/ui-prototyping-studio/SPEC.md:213 |
| ui-prototyping-studio.NewspaperContractAdapter   | maps         | ui-prototyping-studio.RevisionManifestEntry      | docs/features/ui-prototyping-studio/SPEC.md:214 |
| ui-prototyping-studio.MVPStudioIterationWorkflow | orchestrates | ui-prototyping-studio.ApplyApprovedBatch         | docs/features/ui-prototyping-studio/SPEC.md:215 |
| ui-prototyping-studio.GovernanceGatePolicy       | enforces     | ui-prototyping-studio.ApplyApprovedBatch         | docs/features/ui-prototyping-studio/SPEC.md:216 |
| ui-prototyping-studio.StudioSessionState         | enforces     | ui-prototyping-studio.VariantCount               | docs/features/ui-prototyping-studio/SPEC.md:217 |
| ui-prototyping-studio.StudioWorkbenchPage        | renders      | ui-prototyping-studio.VariantCanvas              | docs/features/ui-prototyping-studio/SPEC.md:218 |
| ui-prototyping-studio.StudioWorkbenchPage        | renders      | ui-prototyping-studio.AnnotationPanel            | docs/features/ui-prototyping-studio/SPEC.md:219 |
| ui-prototyping-studio.StudioWorkbenchPage        | renders      | ui-prototyping-studio.MutationApprovalPanel      | docs/features/ui-prototyping-studio/SPEC.md:220 |

## Code Only (missing in docs)

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Direction Mismatch

| From | Edge | To  | Source |
| ---- | ---- | --- | ------ |

## Type Mismatch

| Concept ID | Code Type | Doc Type | Source |
| ---------- | --------- | -------- | ------ |
