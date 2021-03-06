import { Box, color, Serif } from "@artsy/palette"
import { ArtistSeriesRail_collectionGroup } from "__generated__/ArtistSeriesRail_collectionGroup.graphql"
import { AnalyticsSchema } from "Artsy/Analytics"
import { useTracking } from "Artsy/Analytics/useTracking"
import { ArrowButton, Carousel } from "Components/v2/Carousel"
import React, { useEffect } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { data as sd } from "sharify"
import styled from "styled-components"
import { useMedia } from "Utils/Hooks/useMedia"
import { ArtistSeriesRailContainer as ArtistSeriesEntity } from "./ArtistSeriesEntity"

export interface ArtistSeriesRailProps {
  collectionGroup: ArtistSeriesRail_collectionGroup
}
export const ArtistSeriesRail: React.FC<ArtistSeriesRailProps> = ({
  collectionGroup,
}) => {
  const { members } = collectionGroup

  let groupCells: number

  const { xl } = useMedia()

  if (sd.IS_MOBILE) {
    groupCells = 1
  } else if (!xl && members.length <= 4) {
    groupCells = 3
  } else {
    groupCells = 4
  }

  const { trackEvent } = useTracking()

  useEffect(() => {
    trackEvent({
      action_type: AnalyticsSchema.ActionType.Impression,
      context_page: AnalyticsSchema.PageName.CollectionPage,
      context_module: AnalyticsSchema.ContextModule.ArtistCollectionsRail,
      context_page_owner_type: AnalyticsSchema.OwnerType.Collection,
    })
  }, [])

  const trackArrowClick = () => {
    trackEvent({
      action_type: AnalyticsSchema.ActionType.Click,
      context_module: AnalyticsSchema.ContextModule.ArtistCollectionsRail,
      context_page_owner_type: AnalyticsSchema.OwnerType.Collection,
      context_page: AnalyticsSchema.PageName.CollectionPage,
      type: AnalyticsSchema.Type.Button,
      subject: AnalyticsSchema.Subject.ClickedNextButton,
    })
  }

  return (
    <Content mt={2} py={3}>
      <Serif size="5" mb={1}>
        Trending Artist Series
      </Serif>
      <Carousel
        height="250px"
        options={{
          groupCells,
          wrapAround: sd.IS_MOBILE ? true : false,
          cellAlign: "left",
          pageDots: false,
          contain: true,
        }}
        data={members}
        render={(slide, slideIndex) => {
          return <ArtistSeriesEntity member={slide} itemNumber={slideIndex} />
        }}
        onArrowClick={() => trackArrowClick()}
        renderLeftArrow={({ Arrow }) => {
          const showArrowChecker = !xl && members.length <= 4 && !sd.IS_MOBILE
          return (
            <ArrowContainer>
              {members.length > 4 ? (
                <Arrow />
              ) : (
                showArrowChecker && <Arrow showArrow={true} />
              )}
            </ArrowContainer>
          )
        }}
        renderRightArrow={({ Arrow }) => {
          const showArrowChecker = !xl && members.length <= 4 && !sd.IS_MOBILE
          return (
            <ArrowContainer>
              {members.length > 4 ? (
                <Arrow />
              ) : (
                showArrowChecker && <Arrow showArrow={true} />
              )}
            </ArrowContainer>
          )
        }}
      />
    </Content>
  )
}

const Content = styled(Box)`
  border-top: 1px solid ${color("black10")};
`

export const ArrowContainer = styled(Box)`
  align-self: flex-start;
  ${ArrowButton} {
    height: 85%;
  }
`

export const ArtistSeriesRailContainer = createFragmentContainer(
  ArtistSeriesRail,
  {
    collectionGroup: graphql`
      fragment ArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
        groupType
        members {
          ...ArtistSeriesEntity_member
        }
      }
    `,
  }
)
