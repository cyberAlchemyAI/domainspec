interface SessionControlsPanelProps {
  prompt: string;
  variantCount: 1 | 2 | 3;
  busy: boolean;
  sessionId: string | null;
  onPromptChange: (value: string) => void;
  onVariantCountChange: (value: 1 | 2 | 3) => void;
  onStartSession: () => void;
  onSubmitPrompt: () => void;
  onGenerateVariants: () => void;
}

export function SessionControlsPanel(props: SessionControlsPanelProps) {
  return (
    <section
      className="panel ups-panel"
      aria-labelledby="ups-session-controls-heading"
    >
      <header className="panel__header">
        <h3 id="ups-session-controls-heading">Session Controls</h3>
        <p>
          Start a session, submit prompt text, and generate 1..3 deterministic
          variants.
        </p>
      </header>

      <label className="ups-form-field" htmlFor="ups-variant-count">
        <span>Variant count</span>
        <select
          id="ups-variant-count"
          value={String(props.variantCount)}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (value === 1 || value === 2 || value === 3) {
              props.onVariantCountChange(value);
            }
          }}
          data-testid="ups-variant-count"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>

      <button
        type="button"
        className="ups-button ups-button--secondary"
        onClick={props.onStartSession}
        disabled={props.busy}
      >
        {props.busy ? "Starting..." : "Start Session"}
      </button>

      <label className="ups-form-field" htmlFor="ups-prompt-input">
        <span>Prompt</span>
        <textarea
          id="ups-prompt-input"
          placeholder="Describe the UI concept to prototype"
          value={props.prompt}
          onChange={(event) => {
            props.onPromptChange(event.target.value);
          }}
          rows={4}
          data-testid="ups-prompt"
        />
      </label>

      <div className="ups-button-row">
        <button
          type="button"
          className="ups-button"
          onClick={props.onSubmitPrompt}
          disabled={props.busy || !props.sessionId}
        >
          Submit Prompt
        </button>
        <button
          type="button"
          className="ups-button"
          onClick={props.onGenerateVariants}
          disabled={props.busy || !props.sessionId}
        >
          Generate Variants
        </button>
      </div>

      <p className="ups-session-id" data-testid="ups-session-id">
        {props.sessionId ? `sessionId=${props.sessionId}` : "sessionId=pending"}
      </p>
    </section>
  );
}
