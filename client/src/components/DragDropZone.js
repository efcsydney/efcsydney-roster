import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import styled from 'styled-components';

const DragDropZone = DragDropContext(HTML5Backend)(styled.ol`
  background: #eee;
  border-radius: 4px;
  padding: 5px;
`);
DragDropZone.displayName = 'DragDropZone';

export default DragDropZone;
