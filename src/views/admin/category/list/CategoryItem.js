import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEdit, FaPlus, FaArrowsAlt } from 'react-icons/fa';
import { Trash2 } from 'react-feather';

import PermissionGate from "../../../../PermissionGate";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, item) => {
  const customColor = item.type === 2 ? '#D54236' : '#109855';
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 10px 10px 0`,

    display: 'inline-flex',
    width: '100%',
    padding: '10px',

    // change background colour if dragging
    color: '#FFF',
    background: isDragging ? `${customColor}AA` : customColor,
    display: 'inline-flex',
    padding: '10px',
    margin: '0 10px 10px 0',
    border: `1px solid ${customColor}`,
    // styles we need to apply on draggables
    ...draggableStyle,
  };
};

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#F8F8F8' : '#FFF',
  padding: grid,
  margin: '10px 0',
});

const CategoryItem = ({
  type,
  children,
  handleCreateCategory,
  handleEditCategory,
  handleDeleteCategoryId,
}) => (
  // console.log({ children });
  <Droppable droppableId={type} type="droppableSubItem">
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        style={getListStyle(snapshot.isDraggingOver)}
      >
        {children.map((item, index) => (
          <Draggable
            key={item.id_string}
            draggableId={item.id_string}
            index={index}
            isDropDisabled={true} 
          >
            {(provided, snapshot) => (
              <div style={{ display: 'flex' }}>
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    item
                  )}
                >
                  <span
                    className="d-flex align-items-center"
                    {...provided.dragHandleProps}
                  >
                    {item.computed_name}
                    <FaArrowsAlt className="mx-1" />                    
                    <PermissionGate permissions="categories.show">
                      <span
                        className="d-flex mx-1"
                        style={{
                          cursor: 'pointer',
                          fontSize: '150%',
                        }}
                      >
                        <FaEdit onClick={() => handleEditCategory(item)} />
                      </span>
                    </PermissionGate>
                    {/* <span
                        className="d-flex ml-2 text-success"
                        style={{
                          cursor: 'pointer',
                          fontSize: '150%',
                        }}
                        onClick={() => handleCreateCategory(item)}
                      >
                        <FaPlus />
                      </span> */}
                    <PermissionGate permissions="categories.destroy">
                      <span
                        className="d-flex"
                        style={{
                          cursor: 'pointer',
                          fontSize: '150%',
                        }}
                      >
                        <Trash2 onClick={() => handleDeleteCategoryId(item.id)} />
                      </span>
                    </PermissionGate>
                  </span>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

CategoryItem.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCreateCategory: PropTypes.func.isRequired,
  handleEditCategory: PropTypes.func.isRequired,
  handleDeleteCategoryId: PropTypes.func.isRequired,
};

export default CategoryItem;
