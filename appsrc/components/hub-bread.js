
import React, {Component, PropTypes} from 'react'
import {createStructuredSelector} from 'reselect'
import {connect} from './connect'

import {searchFetched, closeSearch} from '../actions'

import Icon from './icon'

class HubBread extends Component {
  render () {
    const {t, path} = this.props

    return <div className='hub_bread'>
      <section className='description'>
        <h2><icon className='icon icon-tag'/> {this.titleForPath(path)}</h2>
        <div className='hub_subtitle'>
        so many elements | a collection by leafbro himself
        </div>
      </section>

      <section className='filler'/>

      <section className='icon_button'>
        <Icon icon='sort-alpha-asc'/>
      </section>

      <section className='icon_button'>
        <Icon icon='filter'/>
      </section>

      <section>
        <input id='search' ref='search' type='search' placeholder={t('search.placeholder')} onChange={this.onChange.bind(this)} onKeyPress={this.onChange.bind(this)}/>
      </section>

      <section className='icon_button'>
        <Icon icon='lifebuoy'/>
      </section>

      <section className='icon_button'>
        <Icon icon='menu'/>
      </section>
    </div>
  }

  onChange () {
    const {search} = this.refs

    if (search.value.length > 0) {
      this.props.openSearch()
    } else {
      this.props.closeSearch()
    }
  }

  titleForPath (path) {
    return `page ${path}`
  }
}

HubBread.propTypes = {
  t: PropTypes.func,

  path: PropTypes.string,

  openSearch: PropTypes.func,
  closeSearch: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
  path: (state) => state.session.navigation.path,
  searchOpen: (state) => state.session.navigation.searchOpen,
  searchResults: (state) => state.session.navigation.searchResults
})

const mapDispatchToProps = (dispatch) => ({
  openSearch: () => dispatch(searchFetched({results: []})),
  closeSearch: () => dispatch(closeSearch({results: []}))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubBread)
