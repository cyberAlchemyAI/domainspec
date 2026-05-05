# Intra-UI Edge Examples (8)

Each section demonstrates one canonical intra-UI edge.

## renders

```yaml
domainspec:
  concept:
    id: ui.player-management.route.players
    type: Page
    concern: sys
  edges:
    - edge: renders
      to: ui.player-management.PlayersTable
```

## wraps

```yaml
domainspec:
  concept:
    id: ui.DashboardLayout
    type: Layout
    concern: sys
  edges:
    - edge: wraps
      to: ui.player-management.route.players
```

## composes

```yaml
domainspec:
  concept:
    id: ui.player-management.SettlementPage
    type: Component
    concern: sys
  edges:
    - edge: composes
      to: ui.player-management.SettlementPreviewCard
```

## consumes

```yaml
domainspec:
  concept:
    id: ui.player-management.PlayersTable
    type: Component
    concern: sys
  edges:
    - edge: consumes
      to: ui.player-management.usePlayers
```

## submits

```yaml
domainspec:
  concept:
    id: ui.player-management.CreatePlayerForm
    type: Form
    concern: sys
  edges:
    - edge: submits
      to: ui.player-management.CreatePlayerAction
```

## shapes

```yaml
domainspec:
  concept:
    id: ui.player-management.PlayerAdapter
    type: Adapter
    concern: sys
  edges:
    - edge: shapes
      to: ui.player-management.PlayerOverview
```

## protects

```yaml
domainspec:
  concept:
    id: ui.AuthGuard
    type: Guard
    concern: sys
  edges:
    - edge: protects
      to: ui.player-management.route.players
```

## displays

```yaml
domainspec:
  concept:
    id: ui.player-management.PlayersOverviewTable
    type: Component
    concern: sys
  edges:
    - edge: displays
      to: ui.player-management.PlayerOverview
```
