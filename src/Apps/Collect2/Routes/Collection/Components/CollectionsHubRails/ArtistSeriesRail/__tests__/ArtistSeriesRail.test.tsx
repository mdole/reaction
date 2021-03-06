import { CollectionsHubLinkedCollections } from "Apps/__tests__/Fixtures/Collections"
import { useTracking } from "Artsy/Analytics/useTracking"
import { ArrowButton } from "Components/v2/Carousel"
import { mount } from "enzyme"
import "jest-styled-components"
import { clone } from "lodash"
import React from "react"
import { ArtistSeriesRail } from "../index"

jest.mock("Artsy/Analytics/useTracking")
jest.mock("Utils/Hooks/useMedia", () => ({
  useMedia: () => ({
    xl: true,
  }),
}))

jest.mock("found", () => ({
  Link: props => <div>{props.children}</div>,
}))

describe("ArtistSeriesRail", () => {
  let props
  const trackEvent = jest.fn()

  function singleData() {
    return {
      title: "1787 keyboard",
      price_guidance: 10000,
      artworks: {
        hits: [
          {
            artist: {
              name: "Jasper Johns",
            },
            title: "keyborad",
            image: {
              url:
                "https://d32dm0rphc51dk.cloudfront.net/4izTOpDv-ew-g1RFXeREcQ/small.jpg",
            },
          },
        ],
      },
    }
  }

  beforeEach(() => {
    props = {
      collectionGroup: CollectionsHubLinkedCollections.linkedCollections[0],
    }
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  it("showing the correct text, price guidance, and title", () => {
    const component = mount(<ArtistSeriesRail {...props} />)
    expect(component.text()).toMatch("Trending Artist Series")
    expect(component.text()).toMatch("Flags unique collections")
    expect(component.text()).toMatch("From $1,000")
  })

  it("Does NOT show arrows when there are exactly 4 collections", () => {
    const newprops = clone(props)
    newprops.collectionGroup.members = [
      singleData(),
      singleData(),
      singleData(),
      singleData(),
    ]
    const Component = mount(<ArtistSeriesRail {...newprops} />)
    expect(Component.find(ArrowButton).length).toBe(0)
  })

  it("Arrows appear when there are more than 5 collections", () => {
    const newprops = clone(props)
    newprops.collectionGroup.members = [
      singleData(),
      singleData(),
      singleData(),
      singleData(),
      singleData(),
      singleData(),
      singleData(),
    ]
    const Component = mount(<ArtistSeriesRail {...newprops} />)
    expect(Component.find(ArrowButton).length).toBe(2)
  })

  describe("Tracking", () => {
    it("Tracks impressions", () => {
      mount(<ArtistSeriesRail {...props} />)

      expect(trackEvent).toBeCalledWith({
        action_type: "Impression",
        context_page: "Collection",
        context_module: "ArtistCollectionsRail",
        context_page_owner_type: "Collection",
      })
    })

    it("Tracks arrow click", () => {
      props.collectionGroup.members = [
        singleData(),
        singleData(),
        singleData(),
        singleData(),
        singleData(),
      ]

      const component = mount(<ArtistSeriesRail {...props} />)
      component
        .find(ArrowButton)
        .at(1)
        .simulate("click")

      expect(trackEvent).toBeCalledWith({
        action_type: "Click",
        context_page: "Collection",
        context_module: "ArtistCollectionsRail",
        context_page_owner_type: "Collection",
        type: "Button",
        subject: "clicked next button",
      })
    })
  })
})
