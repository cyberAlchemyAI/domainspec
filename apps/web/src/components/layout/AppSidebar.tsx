interface AppSidebarProps {
  currentPath: string;
}

const navItems = [
  {
    label: "Knowledge Graph",
    path: "/knowledge-graph",
    description: "Mirror cards, relation graph, and concept detail panel.",
  },
  {
    label: "UI Prototyping Studio",
    path: "/ui-prototyping-studio",
    description:
      "Session start, variant generation, and baseline gate workbench.",
  },
];

export function AppSidebar(props: AppSidebarProps) {
  return (
    <aside className="app-sidebar" aria-label="Primary navigation">
      <div className="app-sidebar__brand">
        <p className="app-sidebar__eyebrow">DomainSpec UI</p>
        <h2>Feature Atlas</h2>
      </div>
      <nav>
        <ul className="app-sidebar__list">
          {navItems.map((item) => {
            const current =
              props.currentPath === item.path ||
              (props.currentPath === "/" && item.path === "/knowledge-graph");

            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`app-sidebar__link ${current ? "is-current" : ""}`}
                  aria-current={current ? "page" : undefined}
                >
                  <span className="app-sidebar__label">{item.label}</span>
                  <span className="app-sidebar__description">
                    {item.description}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
