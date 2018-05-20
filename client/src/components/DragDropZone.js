import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import styled from 'styled-components';

const DragDropZone = DragDropContext(HTML5Backend)(styled.div``);
DragDropZone.displayName = 'DragDropZone';

export default DragDropZone;
