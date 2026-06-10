## Plan

1. **Make mobile Grid truly different from List**
   - Update the Vault ticket container so `grid` mode uses a two-column mobile layout where space allows, instead of looking like a single stacked list.
   - Keep `list` mode as compact horizontal rows.

2. **Improve mobile toggle feedback**
   - Ensure the selected Grid/List button updates visually immediately after each tap.
   - Add clearer active/inactive styling so mobile users can tell which arrangement is selected.

3. **Remove responsive class conflicts**
   - Check the ticket card wrappers for mobile-only classes that force both modes into the same visual layout.
   - Keep the existing desktop/tablet behavior intact.

4. **Verify on mobile**
   - Test `/dashboard` on a mobile viewport.
   - Tap Grid and List repeatedly and confirm the visible ticket layout changes instantly after every click.