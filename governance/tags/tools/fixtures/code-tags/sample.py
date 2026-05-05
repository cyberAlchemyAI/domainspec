def create_player(payload):
    """
    domainspec:
      concept:
        id: player-management.CreatePlayer
        type: Operation
        concern: biz
        spec_ref:
          path: docs/features/payments/SPEC.md
          line: 11
          section: Concept Registry
      edges:
        - edge: produces
          to: player-management.PlayerCreated
    """
    return {"ok": True, "payload": payload}
