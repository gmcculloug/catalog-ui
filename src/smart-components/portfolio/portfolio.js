import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SearchIcon } from '@patternfly/react-icons';
import { withRouter, Route, Switch } from 'react-router-dom';

import PortfolioItem from './portfolio-item';
import OrderModal from '../common/order-modal';
import AddPortfolioModal from './add-portfolio-modal';
import SharePortfolioModal from './share-portfolio-modal';
import { scrollToTop } from '../../helpers/shared/helpers';
import RemovePortfolioModal from './remove-portfolio-modal';
import RemovePortfolioItems from './remove-portfolio-items';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import AddProductsToPortfolio from './add-products-to-portfolio';
import { filterServiceOffering } from '../../helpers/shared/helpers';
import PortfolioItemDetail from './portfolio-item-detail/portfolio-item-detail';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import ContentGalleryEmptyState, { EmptyStatePrimaryAction } from '../../presentational-components/shared/content-gallery-empty-state';
import { fetchSelectedPortfolio, fetchPortfolioItemsWithPortfolio, removeProductsFromPortfolio } from '../../redux/actions/portfolio-actions';

class Portfolio extends Component {
  state = {
    portfolioId: '',
    filteredItems: [],
    selectedItems: [],
    filterValue: '',
    isKebabOpen: false
  };

  handleKebabOpen = isKebabOpen => this.setState({ isKebabOpen });

  fetchData = (apiProps) => {
    this.props.fetchSelectedPortfolio(apiProps);
    this.props.fetchPortfolioItemsWithPortfolio(apiProps);
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id);
    scrollToTop();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData(this.props.match.params.id);
      scrollToTop();
    }
  }

  removeProducts = () => {
    this.props.history.goBack();

    this.props.removeProductsFromPortfolio(this.state.selectedItems, this.props.portfolio.name).then(() => {
      this.fetchData(this.props.match.params.id);
      this.setState({
        selectedItems: []
      });
    });
  };

  handleItemSelect = selectedItem =>
    this.setState(({ selectedItems }) =>
      selectedItems.includes(selectedItem)
        ? ({ selectedItems: [
          ...selectedItems.slice(0, selectedItems.indexOf(selectedItem)),
          ...selectedItems.slice(selectedItems.indexOf(selectedItem) + 1)
        ]})
        : ({ selectedItems: [ ...selectedItems, selectedItem ]}));

  filterItems = filterValue => this.props.portfolioItems.filter(item => filterServiceOffering(item, filterValue));

  handleFilterChange = filterValue => {
    this.setState({ filterValue });
  };

  renderEmptyState = () => (
    <ContentGalleryEmptyState
      Icon={ SearchIcon }
      title={ `No products in ${this.props.portfolio.name} portfolio` }
      description="You haven’t added any products to the portfolio"
      PrimaryAction={ () => <EmptyStatePrimaryAction url={ `${this.props.match.url}/add-products` } label="Add products" /> }
    />
  )

  renderProducts = ({
    title,
    filteredItems,
    addProductsRoute,
    editPortfolioRoute,
    sharePortfolioRoute,
    removeProductsRoute,
    removePortfolioRoute
  }) => (
    <Fragment>
      <ToolbarRenderer schema={ createPortfolioToolbarSchema({
        filterProps: {
          searchValue: this.state.filterValue,
          onFilterChange: this.handleFilterChange,
          placeholder: 'Filter by name...'
        },
        title,
        addProductsRoute,
        removeProductsRoute,
        editPortfolioRoute,
        sharePortfolioRoute,
        removePortfolioRoute,
        isLoading: this.props.isLoading,
        setKebabOpen: this.handleKebabOpen,
        isKebabOpen: this.state.isKebabOpen
      }) } />
      <Route exact path="/portfolios/detail/:id/edit-portfolio" component={ AddPortfolioModal } />
      <Route exact path="/portfolios/detail/:id/remove-portfolio" component={ RemovePortfolioModal } />
      <Route exact path="/portfolios/detail/:id/share-portfolio" component={ SharePortfolioModal } />
      <Route exact path="/portfolios/detail/:id/order/:itemId" render={ props => <OrderModal { ...props } closeUrl={ this.props.match.url } /> } />
      <ContentGallery { ...filteredItems } renderEmptyState={ this.renderEmptyState } />
    </Fragment>
  )

  renderAddProducts = ({ portfolioRoute }) => (
    <AddProductsToPortfolio
      portfolio={ this.props.portfolio }
      portfolioRoute={ portfolioRoute }
    />
  );

  renderRemoveProducts = ({ portfolioRoute, filteredItems, title }) => (
    <React.Fragment>
      <RemovePortfolioItems
        filterValue={ this.state.filterValue }
        onFilterChange={ this.handleFilterChange }
        portfolioName={ title }
        portfolioRoute={ portfolioRoute }
        onRemove={ this.removeProducts }
        disableButton={ this.state.selectedItems.length === 0 }
      />
      <ContentGallery { ...filteredItems } />
    </React.Fragment>
  );

  render() {
    const portfolioRoute = this.props.match.url;
    const addProductsRoute = `${this.props.match.url}/add-products`;
    const removeProductsRoute = `${this.props.match.url}/remove-products`;
    const editPortfolioRoute = `${this.props.match.url}/edit-portfolio`;
    const removePortfolioRoute = `${this.props.match.url}/remove-portfolio`;
    const sharePortfolioRoute = `${this.props.match.url}/share-portfolio`;
    const orderUrl = `${this.props.match.url}/product`;
    const title = this.props.portfolio ? this.props.portfolio.name : '';

    const filteredItems = {
      items: this.props.portfolioItems
      .filter(item => filterServiceOffering(item, this.state.filterValue))
      .map(item => (
        <PortfolioItem
          key={ item.id }
          { ...item }
          isSelectable={ this.props.location.pathname.includes('/remove-products') }
          onSelect={ this.handleItemSelect }
          isSelected={ this.state.selectedItems.includes(item.id) }
          orderUrl={ `${orderUrl}/${item.id}` }
        />
      )),
      isLoading: this.props.isLoading && this.props.portfolioItems.length === 0
    };
    return (
      <Switch>
        <Route path={ addProductsRoute } render={ props => this.renderAddProducts({ portfolioRoute, ...props }) } />
        <Route path={ `${orderUrl}/:portfolioItemId` } component={ PortfolioItemDetail }/>
        <Route
          path={ removeProductsRoute }
          render={ props => this.renderRemoveProducts({ filteredItems, portfolioRoute, title, ...props }) }
        />
        <Route
          path={ portfolioRoute }
          render={ props => this.renderProducts(
            { addProductsRoute, removeProductsRoute, editPortfolioRoute,
              removePortfolioRoute, sharePortfolioRoute, filteredItems, title, ...props }) }
        />
      </Switch>
    );
  }
}

const mapStateToProps = ({ portfolioReducer: { selectedPortfolio, portfolioItems, isLoading }}) => ({
  portfolio: selectedPortfolio,
  portfolioItems,
  isLoading: !selectedPortfolio || isLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPortfolioItemsWithPortfolio,
  fetchSelectedPortfolio,
  removeProductsFromPortfolio
}, dispatch);

Portfolio.propTypes = {
  isLoading: PropTypes.bool,
  fetchPortfolioItemsWithPortfolio: PropTypes.func,
  fetchSelectedPortfolio: PropTypes.func,
  match: PropTypes.object,
  portfolio: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string.isRequired
  }),
  location: PropTypes.object,
  history: PropTypes.object,
  portfolioItems: PropTypes.array,
  removeProductsFromPortfolio: PropTypes.func.isRequired
};

Portfolio.defaultProps = {
  portfolioItems: []
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
