We want to get the presentations from our database into our table. For this lesson,
create `loader` function to get the data, then use the `useLoaderData` hook to
make the table rows in our component.

1. Create a `loader` function in `presentation.tsx` to get the presentations.
2. Update the `Presentations` component to display each presentation as a row in the table.

**Hints**:

- All the database logic is tucked away in `import {getPresentations} from "~/utils/presentations.server"`
- `useLoaderData` is generically typed, so use `useLoaderData<AugmentedData>()` to get your data typed
  This makes it easier to reference the data.
- `import { AugmentedPresentation } from "~/types"`
