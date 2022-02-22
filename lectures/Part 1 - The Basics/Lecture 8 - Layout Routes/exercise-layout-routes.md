1. Add the `/presentation/$presentationId` route, (you can just copy from the lecture)
2. Link to the `/presentation/$presentationId` route in name column of the table
   from the `/presentation` route.
3. Add the `/presentation/$presentationId/schedule` route (you can just copy from the lecture)
4. Add the `/presentation/$presentationId/edit` route.

Hints:

- The `edit` route should be very similar to the `schedule` root, but you will
  use the `<PresentationForm>` instead of the `<ScheduleForm>` component.
- You can use the `updatePresentation` function to update the presentation values.
