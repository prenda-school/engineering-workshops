import { Form } from "remix"
export type LoginActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    username: string
    password: string
  }
}
export const LoginForm = ({
  actionData,
  searchParams,
}: {
  actionData: LoginActionData | undefined
  searchParams: URLSearchParams
}) => (
  <Form
    method="post"
    replace
    reloadDocument
    aria-describedby={actionData?.formError ? "form-error-message" : undefined}
  >
    <input
      type="hidden"
      name="redirectTo"
      value={searchParams.get("redirectTo") ?? undefined}
    />
    <input
      type="text"
      id="username-input"
      name="username"
      placeholder="username"
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
    <input
      id="password-input"
      name="password"
      placeholder="password"
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
  </Form>
)
