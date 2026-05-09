import type {
  StudioBaselineProvenance,
  StudioGateState,
  StudioVariant,
} from "../../lib/api";

interface VariantCanvasProps {
  variants: StudioVariant[];
  selectionGate: StudioGateState;
  baseline: StudioBaselineProvenance | null;
  variantCount: 1 | 2 | 3;
  busy: boolean;
  onSelectBaseline: (label: string) => void;
}

/**
 * domainspec:
 *   concept:
 *     id: ui-prototyping-studio.VariantCanvas
 *     type: Component
 *     concern: sys
 */
export function VariantCanvas(props: VariantCanvasProps) {
  return (
    <section
      className="panel ups-panel"
      aria-labelledby="ups-variant-canvas-heading"
    >
      <header className="panel__header">
        <h3 id="ups-variant-canvas-heading">Variant Canvas</h3>
        <p>Candidate previews and deterministic baseline controls.</p>
      </header>

      {props.variants.length === 0 ? (
        <p className="ups-note">No variants generated yet.</p>
      ) : (
        <ul className="ups-variant-grid" data-testid="ups-variant-grid">
          {props.variants.map((variant) => {
            const isBaseline = props.baseline?.label === variant.variantLabel;
            const cardClass = `ups-variant-card ${isBaseline ? "is-baseline" : ""}`;

            return (
              <li key={variant.variantLabel} className={cardClass}>
                <header>
                  <h4>Variant {variant.variantLabel}</h4>
                  <p className="ups-variant-status">status={variant.status}</p>
                </header>
                <p>{variant.rationale}</p>
                <p>{variant.tradeoffs}</p>
                <p>{variant.risk}</p>
                <p className="ups-variant-artifact">
                  artifact={variant.htmlArtifactRef}
                </p>
                <p className="ups-variant-components">
                  components={variant.componentsUsed.join(", ")}
                </p>
                {props.variantCount > 1 ? (
                  <button
                    type="button"
                    className="ups-button"
                    onClick={() => {
                      props.onSelectBaseline(variant.variantLabel);
                    }}
                    disabled={props.busy}
                  >
                    Select Baseline {variant.variantLabel}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <p className="ups-note" data-testid="ups-selection-gate">
        selectionGate={props.selectionGate}
      </p>
      {props.variantCount === 1 && props.baseline?.mode === "committed" ? (
        <p className="ups-note" data-testid="ups-single-variant-branch">
          Single-variant branch committed baseline: {props.baseline.label}
        </p>
      ) : null}
    </section>
  );
}
