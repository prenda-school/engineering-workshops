import { Form } from "remix"

export const VoteButton = ({
  userId,
  presentationId,
}: {
  userId: string
  presentationId: string
}) => {
  return (
    <Form method="post" action={`/vote/${userId}/${presentationId}`}>
      <input
        type="submit"
        className="button button-light"
        value="I'm interested"
      />
    </Form>
  )
}
