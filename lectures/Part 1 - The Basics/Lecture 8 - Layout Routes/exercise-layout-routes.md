1. Add the `/presentation/$presentationId` route, (you can just copy from the lecture)
2. Add the `/presentation/$presentationId/schedule` route (you can just copy from the lecture)
3. Add the `/presentation/$presentationId/edit` route.

Hints:

- The `edit` route should be very similar to the `schedule` root, but you will
  use the `<PresentationForm>` instead of the `<ScheduleForm>` component.
- You can use the `updatePresentation` function to update the presentation values.
