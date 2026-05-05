# Cross-Layer Edge Examples (6)

Each section demonstrates one canonical UI-backend edge.

## fetches

```yaml
domainspec:
  concept:
    id: ui.player-management.usePlayers
    type: Binding
    concern: sys
  edges:
    - edge: fetches
      to: player-management.GetAllPlayers
```

## mutates

```yaml
domainspec:
  concept:
    id: ui.player-management.useCreatePlayer
    type: Binding
    concern: sys
  edges:
    - edge: mutates
      to: player-management.CreatePlayer
```

## reflects

```yaml
domainspec:
  concept:
    id: ui.player-management.PlayerStatusBadge
    type: State Indicator
    concern: sys
  edges:
    - edge: reflects
      to: player-management.PlayerStatus
```

## derives

```yaml
domainspec:
  concept:
    id: ui.player-management.PlayerOverview
    type: View Model
    concern: sys
  edges:
    - edge: derives
      to: player-management.Player
```

## contracts

```yaml
domainspec:
  concept:
    id: ui.player-management.CreatePlayerForm
    type: Form
    concern: sys
  edges:
    - edge: contracts
      to: player-management.PlayerAPI
```

## mirrors

```yaml
domainspec:
  concept:
    id: ui.AdminGuard
    type: Guard
    concern: sys
  edges:
    - edge: mirrors
      to: auth.AdminRoleRule
```
