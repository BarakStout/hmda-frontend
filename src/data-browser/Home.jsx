import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ImageCard from './ImageCard.jsx'
import Heading from '../common/Heading.jsx'
import { withAppContext } from '../common/appContextHOC'
import filterColor from '../common/images/db-filter-color.png'
import filterBw from '../common/images/db-filter-bw.png'
import mapColor from '../common/images/db-map-color.png'
import mapBw from '../common/images/db-map-bw.png'

import './Home.css'
import ExternalLink from '../common/ExternalLink'

class Home extends Component {
  render() {
    const { showMaps, publicationReleaseYear } = this.props.config
    return (
      <div className='home'>
        <div className='intro'>
          <Heading type={1} headingText='HMDA Data Browser'>
            <p className='lead'>
              HMDA Data Browser allows you to filter, aggregate, download, and
              visualize HMDA datasets.
            </p>
            <p className='lead'>
              Visit our{' '}
              <ExternalLink
                url='https://cfpb.github.io/hmda-platform/#data-browser-api'
                text='HMDA API Documentation'
              />{' '}
              page to learn more about the HMDA Data Browser API.
            </p>
          </Heading>
        </div>

        <h3>I would like to...</h3>

        <div className='card-container'>
          <ImageCard
            year={publicationReleaseYear}
            caption='Select, Summarize, Download'
            description='Filter and download HMDA datasets'
            path='data'
            enabled
            image={filterBw}
            imageHover={filterColor}
            faq={{
              url: `/documentation/${publicationReleaseYear}/data-browser-faq`,
              label: 'HMDA Dataset Filtering FAQ',
            }}
          />
          <ImageCard
            year={publicationReleaseYear}
            caption={
              <span>
                Explore, Compare, Share
                {showMaps ? (
                  ''
                ) : (
                  <>
                    <br />
                    (coming soon)
                  </>
                )}
              </span>
            }
            path='maps'
            enabled={showMaps ? true : false}
            description='Explore HMDA datasets using an interactive map'
            image={mapBw}
            imageHover={mapColor}
            faq={{
              url: `/documentation/${publicationReleaseYear}/data-browser-maps-faq`,
              label: 'HMDA Maps FAQ',
            }}
          />
        </div>
      </div>
    )
  }
}

export default withAppContext(Home)
