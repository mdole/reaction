import { Separator, Serif } from "@artsy/palette"
import { Collect_marketingCollections } from "__generated__/Collect_marketingCollections.graphql"
import { Collect_viewer } from "__generated__/Collect_viewer.graphql"
import { CollectFilterFragmentContainer as ArtworkGrid } from "Apps/Collect2/Components/Base/CollectFilterContainer"
import { SeoProductsForArtworks } from "Apps/Collect2/Components/Seo/SeoProductsForArtworks"
import { AppContainer } from "Apps/Components/AppContainer"
import { withSystemContext } from "Artsy"
import { track } from "Artsy/Analytics"
import * as Schema from "Artsy/Analytics/Schema"
import { FrameWithRecentlyViewed } from "Components/FrameWithRecentlyViewed"
import { CollectionsHubsNavFragmentContainer as CollectionsHubsNav } from "Components/v2/CollectionsHubsNav"
import { BreadCrumbList } from "Components/v2/Seo"
import React, { Component } from "react"
import { Link, Meta, Title } from "react-head"
import { createFragmentContainer, graphql } from "react-relay"
import { data as sd } from "sharify"
import { getMetadataForMedium } from "./CollectMediumMetadata"

export interface CollectAppProps {
  viewer: Collect_viewer
  marketingCollections: Collect_marketingCollections
  COLLECTION_HUBS?: string
  params?: {
    medium: string
  }
}

@track({
  context_page: Schema.PageName.CollectPage,
})
export class CollectApp extends Component<CollectAppProps> {
  render() {
    const {
      params,
      viewer: { filter_artworks },
    } = this.props
    const medium = params && params.medium
    const { description, breadcrumbTitle, title } = getMetadataForMedium(medium)
    const canonicalHref = medium
      ? `${sd.APP_URL}/collect/${medium}`
      : `${sd.APP_URL}/collect`

    // client renders will get COLLECTION_HUBS from sd; server renders
    //   will get it from the SystemContext.
    const showCollectionHubs =
      sd.COLLECTION_HUBS === "experiment" ||
      this.props.COLLECTION_HUBS === "experiment"

    return (
      <AppContainer>
        <FrameWithRecentlyViewed>
          <Title>{title}</Title>
          <Meta property="og:url" content={`${sd.APP_URL}/collect`} />
          <Meta
            property="og:image"
            content={`${sd.APP_URL}/images/og_image.jpg`}
          />
          <Meta name="description" content={description} />
          <Meta property="og:description" content={description} />
          <Meta property="twitter:description" content={description} />
          <Link rel="canonical" href={canonicalHref} />
          <BreadCrumbList
            items={[
              { path: "/collect", name: "Collect" },
              medium && {
                path: `/collect/${medium}`,
                name: breadcrumbTitle,
              },
            ].filter(Boolean)}
          />
          <SeoProductsForArtworks artworks={filter_artworks} />

          <Serif size="8" mt={3} element="h1">
            Collect art and design online
          </Serif>
          <Separator mt={2} mb={[2, 2, 2, 4]} />

          {showCollectionHubs && (
            <>
              <CollectionsHubsNav
                marketingCollections={this.props.marketingCollections}
              />

              <Separator mb={2} mt={[2, 2, 2, 4]} />
            </>
          )}

          <ArtworkGrid viewer={this.props.viewer} />
        </FrameWithRecentlyViewed>
      </AppContainer>
    )
  }
}

export const CollectAppFragmentContainer = createFragmentContainer(
  withSystemContext(CollectApp),
  {
    marketingCollections: graphql`
      fragment Collect_marketingCollections on MarketingCollection
        @relay(plural: true) {
        ...CollectionsHubsNav_marketingCollections
      }
    `,
    viewer: graphql`
      fragment Collect_viewer on Viewer
        @argumentDefinitions(
          medium: { type: "String", defaultValue: "*" }
          major_periods: { type: "[String]" }
          partner_id: { type: "ID" }
          for_sale: { type: "Boolean" }
          at_auction: { type: "Boolean" }
          acquireable: { type: "Boolean" }
          offerable: { type: "Boolean" }
          inquireable_only: { type: "Boolean" }
          aggregations: { type: "[ArtworkAggregation]", defaultValue: [TOTAL] }
          sort: { type: "String", defaultValue: "-partner_updated_at" }
          price_range: { type: "String" }
          height: { type: "String" }
          width: { type: "String" }
          artist_id: { type: "String" }
          attribution_class: { type: "String" }
          color: { type: "String" }
          page: { type: "Int" }
          dimension_range: { type: "String" }
        ) {
        filter_artworks(aggregations: $aggregations, sort: $sort) {
          ...SeoProductsForArtworks_artworks
        }

        ...CollectFilterContainer_viewer
          @arguments(
            medium: $medium
            major_periods: $major_periods
            partner_id: $partner_id
            for_sale: $for_sale
            sort: $sort
            acquireable: $acquireable
            offerable: $offerable
            at_auction: $at_auction
            inquireable_only: $inquireable_only
            price_range: $price_range
            height: $height
            width: $width
            artist_id: $artist_id
            attribution_class: $attribution_class
            color: $color
            page: $page
            dimension_range: $dimension_range
          )
      }
    `,
  }
)
