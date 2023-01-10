import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ButtonCSS, Button } from '@adminjs/design-system';
import { RecordJSON, ViewHelpers, PropertyJSON } from 'adminjs';

interface Props {
  property: PropertyJSON;
  record: any;
}

const StyledLink = styled<any>(Link)`
  padding-left: ${({ theme }): string => theme.space.xs};
  padding-right: ${({ theme }): string => theme.space.xs};
`;

const ReferenceValue: React.FC<Props> = (props) => {
  const { property, record } = props;

  const h = new ViewHelpers();
  const refId = record.id;
  const href = h.recordActionUrl({
    resourceId: property.reference,
    recordId: refId,
    actionName: 'show',
  });
  return (
    <StyledLink to={href}>
      <Button size="sm" rounded>
        {record.name}
      </Button>
    </StyledLink>
  );
};

export default ReferenceValue;
