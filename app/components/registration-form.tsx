export type ActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    username: string
    firstname: string
    lastname: string
    password: string
  }
}

export const RegistrationForm = ({
  actionData,
  searchParams,
}: {
  actionData: ActionData | undefined
  searchParams: URLSearchParams
}) => {
  return (
    <form
      method="post"
      aria-describedby={
        actionData?.formError ? "form-error-message" : undefined
      }
    >
      <input
        type="hidden"
        name="redirectTo"
        value={searchParams.get("redirectTo") ?? undefined}
      />
      <div>
        <label htmlFor="username-input">Username</label>
        <input
          type="text"
          id="username-input"
          name="username"
          defaultValue={actionData?.fields?.username}
          aria-invalid={Boolean(actionData?.fieldErrors?.username)}
          aria-describedby={
            actionData?.fieldErrors?.username ? "username-error" : undefined
          }
        />
        {actionData?.fieldErrors?.username ? (
          <p className="form-validation-error" role="alert" id="username-error">
            {actionData?.fieldErrors.username}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="firstname-input">Firstname</label>
        <input
          type="text"
          id="firstname-input"
          name="firstname"
          defaultValue={actionData?.fields?.firstname}
        />
      </div>
      <div>
        <label htmlFor="lastname-input">Lastname</label>
        <input
          type="text"
          id="lastname-input"
          name="lastname"
          defaultValue={actionData?.fields?.lastname}
        />
      </div>
      <div>
        <label htmlFor="password-input">Password</label>
        <input
          id="password-input"
          name="password"
          defaultValue={actionData?.fields?.password}
          type="password"
          aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
          aria-describedby={
            actionData?.fieldErrors?.password ? "password-error" : undefined
          }
        />
        {actionData?.fieldErrors?.password ? (
          <p className="form-validation-error" role="alert" id="password-error">
            {actionData?.fieldErrors.password}
          </p>
        ) : null}
      </div>
      <div id="form-error-message">
        {actionData?.formError ? (
          <p className="form-validation-error" role="alert">
            {actionData?.formError}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        className="button button-dark"
        style={{ margin: "auto" }}
      >
        Submit
      </button>
    </form>
  )
}
