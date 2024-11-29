import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEdit, FaPlus, FaArrowsAlt } from 'react-icons/fa';
import { Row, Col, Card, CardBody } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

import DefaultCategories from './DefaultCategories';
import CategoryItem from './CategoryItem';
import CategorySidebar from './CategorySidebar';
import '../../../../assets/scss/pages/data-list.scss';

import {
  getCategoriesTree,
  updateCategory,
  storeCategory,
  destroyCategory,
  updateDefaultCategories,
} from '../../../../services/apis/category.api';

import { store } from '../../../../redux/storeConfig/store';
import { applicationActions } from '../../../../new.redux/actions';

import PermissionGate from '../../../../PermissionGate';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#FFF',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#F8F8F8' : '#FFF',
  padding: grid,
  // width: 200,
});

const CategoryList = ({ currentCompanyId }) => {
  const [categoryItems, setCategoryItems] = useState([]);
  const [lastLevelCategories, setLastLevelCategories] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState({});
  const [categoryFather, setCategoryFather] = useState({});
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [showModalDeleteCategory, setShowModalDeleteCategory] = useState(false);

  const getInitialData = async () => {
    const { data: dataCategoryItems } = await getCategoriesTree();
    setCategoryItems(dataCategoryItems);
    setLastLevelCategories(
      dataCategoryItems
        .map((category) => category.children)
        .flat()
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  useEffect(() => {
    getInitialData();
  }, [currentCompanyId]);

  const handleEditCategory = (category) => {
    setShowSidebar(true);
    setCategoryToEdit(category);
    setCategoryFather({});
  };

  const handleCreateCategory = (_categoryFather) => {
    setShowSidebar(true);
    setCategoryToEdit({});
    setCategoryFather(_categoryFather);
  };

  const handleDeleteCategoryId = (id) => {
    setDeleteCategoryId(id);
    setShowModalDeleteCategory(true);
  };

  const submitDeleteCategory = async () => {
    setShowModalDeleteCategory(false);
    const respDestroyCategory = await destroyCategory({
      id: deleteCategoryId,
    });
    if (respDestroyCategory.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Categoria excluída com sucesso',
          hasTimeout: true,
        })
      );
      getInitialData();
    }
  };

  const handleUpdateCategory = async (category) => {
    const respUpdateCategory = await updateCategory({ category });
    if (respUpdateCategory.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Categoria editada com sucesso',
          hasTimeout: true,
        })
      );
      setShowSidebar(false);
      getInitialData();
    }
  };

  const handleUpdateDefaultCategories = async (defaultCategories) => {
    await updateDefaultCategories({ defaultCategories });
    getInitialData();
  };

  const handleStoreCategory = async (category) => {
    const respStoreCategory = await storeCategory({
      category: {
        ...category,
        category_id: categoryFather.id,
        dre_category_id: categoryFather.dre_category_id,
        type: categoryFather.type,
      },
      categoryFather,
    });
    if (respStoreCategory.status === 204) {
      store.dispatch(
        applicationActions.toggleDialog({
          type: 'success',
          title: 'Sucesso',
          message: 'Categoria adicionada com sucesso',
          hasTimeout: true,
        })
      );
      setShowSidebar(false);
      getInitialData();
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === 'droppableItem') {
      const items = reorder(categoryItems, sourceIndex, destIndex);
      setCategoryItems(items);
    } else if (result.type === 'droppableSubItem') {
      const itemSubItemMap = categoryItems.reduce((acc, item) => {
        acc[item.id_string] = item.children;
        return acc;
      }, {});

      // const sourceParentId = parseInt(result.source.droppableId);
      // const destParentId = parseInt(result.destination.droppableId);
      const sourceParentId = result.source.droppableId;
      const destParentId = result.destination.droppableId;

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...categoryItems];

      /** In this case children are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );
        newItems = newItems.map((item) => {
          if (item.id_string === sourceParentId) {
            item.children = reorderedSubItems;
          }
          return item;
        });
        setCategoryItems(newItems);
      } else {
        const newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        const newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems = newItems.map((item) => {
          if (item.id_string === sourceParentId) {
            item.children = newSourceSubItems;
          } else if (item.id_string === destParentId) {
            item.children = newDestSubItems;
          }
          return item;
        });
        setCategoryItems(newItems);
      }
    }
  };
  /*
  let permissionForm = '';
  let permissionButton = '';
  if(bankAccount.bank_id)
  {
    permissionForm = 'categories.tree';
    permissionButton = 'bank-accounts.update';
  }
  else
  {
    permissionForm = 'bank-accounts.store';
    permissionButton = 'bank-accounts.store';
  }
 */

  return (
    <>
      {categoryItems.length > 0 && (
        <Row>
          <Col sm="12">
            <DefaultCategories
              lastLevelCategories={lastLevelCategories}
              handleUpdateDefaultCategories={handleUpdateDefaultCategories}
            />
            <Card>
              <CardBody className="pt-2">
                <Row>
                  <Col className="ml-2 mt-1" sm="12">
                    <h3 className="mb-2 text-primary">
                      <span className="align-middle">Gerenciar Categorias</span>
                    </h3>
                  </Col>
                </Row>
                <div className="data-list">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" type="droppableItem">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {categoryItems.map((item, index) => (
                            <Draggable
                              key={item.id_string}
                              draggableId={item.id_string}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div>
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
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
                                          className="text-success d-flex"
                                          style={{
                                            cursor: 'pointer',
                                            fontSize: '150%',
                                          }}
                                        >
                                          <FaEdit
                                            onClick={() =>
                                              handleEditCategory(item)
                                            }
                                          />
                                        </span>
                                      </PermissionGate>

                                      <PermissionGate permissions="categories.store">
                                        <span
                                          className="d-flex ml-2 text-success"
                                          style={{
                                            cursor: 'pointer',
                                            fontSize: '150%',
                                          }}
                                        >
                                          <FaPlus
                                            onClick={() =>
                                              handleCreateCategory(item)
                                            }
                                          />
                                        </span>
                                      </PermissionGate>
                                    </span>
                                    <CategoryItem
                                      type={item.id_string}
                                      children={item.children}
                                      handleEditCategory={handleEditCategory}
                                      handleCreateCategory={
                                        handleCreateCategory
                                      }
                                      handleDeleteCategoryId={
                                        handleDeleteCategoryId
                                      }
                                    />
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
                  </DragDropContext>
                  <CategorySidebar
                    category={categoryToEdit}
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    handleUpdateCategory={handleUpdateCategory}
                    handleStoreCategory={handleStoreCategory}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <div className={showModalDeleteCategory ? 'global-dialog' : ''}>
            <SweetAlert
              showCancel
              reverseButtons={false}
              cancelBtnBsStyle="secondary"
              confirmBtnBsStyle="danger"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              warning
              title="Excluir Categoria!"
              show={showModalDeleteCategory}
              onConfirm={submitDeleteCategory}
              onClose={() => setShowModalDeleteCategory(false)}
              onCancel={() => setShowModalDeleteCategory(false)}
            >
              <h4 className="sweet-alert-text my-2">
                Confirma a exclusão desta categoria?
              </h4>
            </SweetAlert>
          </div>
        </Row>
      )}
    </>
  );
};

CategoryList.propTypes = {
  currentCompanyId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentCompanyId: state.companies.currentCompanyId,
});

export default connect(mapStateToProps)(CategoryList);
