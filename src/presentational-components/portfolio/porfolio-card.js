import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ItemDetails from '../shared/card-common';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownSeparator,
  GalleryItem,
  KebabToggle,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import PortfolioCardHeader from './portfolio-card-header';

import './portfolio-card.scss';
import { createModifiedLabel } from '../../helpers/shared/helpers';

const TO_DISPLAY = [ 'description' ];

const createToolbarActions = (portfolioName, portfolioId, isOpen, setOpen) => [
  <Dropdown
    key="portfolio-dropdown"
    isOpen={ isOpen }
    isPlain
    onSelect={ () => setOpen(false) }
    position={ DropdownPosition.right }
    toggle={ <KebabToggle onToggle={ setOpen }/> }
    dropdownItems={ [
      <DropdownItem key="share-portfolio-action">
        <Link to={ `/portfolios/share/${portfolioId}` } className="pf-c-dropdown__menu-item" >
          Share
        </Link>
      </DropdownItem>,
      <DropdownSeparator key="share-portfolio-separator"/>,
      <DropdownItem key="edit-portfolio-action">
        <Link to={ `/portfolios/edit/${portfolioId}` } className="pf-c-dropdown__menu-item" >
          Edit
        </Link>
      </DropdownItem>,
      <DropdownItem key="remove-portfolio-action">
        <Link to={ `/portfolios/remove/${portfolioId}` } className="pf-c-dropdown__menu-item destructive-color">
          Delete
        </Link>
      </DropdownItem>
    ] }/>
];

const PortfolioCard = ({ imageUrl, name, id, ...props }) => {
  const [ isOpen, setOpen ] = useState(false);
  return (
    <GalleryItem>
      <Card className="content-gallery-card">
        <Link className="card-link" to={ `/portfolios/detail/${id}` }>
          <CardHeader>
            <PortfolioCardHeader
              portfolioName={ name }
              headerActions={ createToolbarActions(name, id, isOpen, setOpen) }
            />
          </CardHeader>
          <CardBody>
            <TextContent>
              <Text component={ TextVariants.small }>
                { createModifiedLabel(new Date(props.updated_at || props.created_at), props.owner) }
              </Text>
            </TextContent>
            <ItemDetails { ...{ name, imageUrl, ...props } } toDisplay={ TO_DISPLAY } />
          </CardBody>
          <CardFooter/>
        </Link>
      </Card>
    </GalleryItem>
  );};

PortfolioCard.propTypes = {
  history: PropTypes.object,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired
};

export default PortfolioCard;
