import { Theme } from "@artsy/palette"
import { CollectionsHubsHomepageNavQuery } from "__generated__/CollectionsHubsHomepageNavQuery.graphql"
import { useSystemContext } from "Artsy"
import { renderWithLoadProgress } from "Artsy/Relay/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { storiesOf } from "storybook/storiesOf"
import { CollectionsHubsHomepageNavFragmentContainer } from "../CollectionsHubsHomepageNav"

storiesOf("Components/CollectionsHubsHomepageNav", module).add(
  "default",
  () => (
    <Theme>
      <CollectionsHubsHomepageNavQueryRenderer />
    </Theme>
  )
)

const CollectionsHubsHomepageNavQueryRenderer = () => {
  const { relayEnvironment } = useSystemContext()

  return (
    <QueryRenderer<CollectionsHubsHomepageNavQuery>
      environment={relayEnvironment}
      variables={{}}
      query={graphql`
        query CollectionsHubsHomepageNavQuery {
          marketingCollections(size: 6) {
            ...CollectionsHubsHomepageNav_marketingCollections
          }
        }
      `}
      render={renderWithLoadProgress(
        CollectionsHubsHomepageNavFragmentContainer
      )}
    />
  )
}
