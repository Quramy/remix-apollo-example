import { useFragment } from "@apollo/client/index.js";
import { graphql } from "#app/gql";

const fragment = graphql(`
  fragment Comment_Comment on Comment {
    body
  }
`);

type Props = {
  comment: {
    readonly __typename?: string;
    readonly id: string;
  };
};

export function Comment({ comment }: Props) {
  const { data } = useFragment({
    fragment,
    from: comment,
  });

  return (
    <>
      <h3>Comment:</h3>
      <p>{data.body}</p>
    </>
  );
}
