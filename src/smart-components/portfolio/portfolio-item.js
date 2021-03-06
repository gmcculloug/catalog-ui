import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardFooter, GalleryItem } from '@patternfly/react-core';

import { CATALOG_API_BASE } from '../../utilities/constants';
import CardIcon from '../../presentational-components/shared/card-icon';
import CardCheckbox from '../../presentational-components/shared/card-checkbox';
import ServiceOfferingCardBody from '../../presentational-components/shared/service-offering-body';

import './portfolio-item.scss';

const PortfolioItem = props => {
  const renderCardContent = () => (
    <Fragment>
      <CardHeader className="card_header">
        { props.isSelectable && <CardCheckbox
          handleCheck={ () => props.onSelect(props.id) }
          isChecked={ props.isSelected }
          id={ props.id } />
        }

        <CardIcon src={ `${CATALOG_API_BASE}/portfolio_items/${props.id}/icon` }/>
      </CardHeader>
      <ServiceOfferingCardBody { ...props }/>
      <CardFooter>
      </CardFooter>
    </Fragment>
  );
  return (
    <GalleryItem>
      <Card className="content-gallery-card">
        { props.isSelectable ? renderCardContent() : (
          <Link to={ props.orderUrl } className="card-link" >
            { renderCardContent() }
          </Link>
        ) }
      </Card>
    </GalleryItem>
  );};

PortfolioItem.propTypes = {
  history: PropTypes.object,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  orderUrl: PropTypes.string.isRequired
};

export default PortfolioItem;
