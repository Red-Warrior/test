import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getIngredients } from "../../services/ingredients/actions";
import { getStoreIngredients } from "../../services/ingredients/selectors";
import { getStoreIngredientsConstructor } from "../../services/current-ingredient/selectors";

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import Modal from "../modal/modal";
import IngredientDetails from "../modal/components/ingredient-details/ingredient-details";
import OrderDetails from "../modal/components/order-details/order-details";
import Spinner from "../spinner/spinner";
import styles from "./app.module.css";
import modalStyles from "../modal/modal.module.css";

const App = () => {
  const dispatch = useDispatch();

  const {ingredients, ingredientsRequest, ingredientsFailed} = useSelector(getStoreIngredients);
  const {modalType, modalIsOpen} = useSelector(getStoreIngredientsConstructor);

  useEffect(
    () => {
      dispatch(getIngredients());
    },
    [dispatch]
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      {
        ingredientsRequest && (
          <div className={styles.loading}>
            <div className="text text_type_main-large text_color_inactive pb-6">Загрузка...</div>
            <Spinner />
          </div>)
      }
      {ingredientsFailed && 'Произошла ошибка'}
      {
        !ingredientsRequest &&
        !ingredientsFailed &&
        ingredients && ingredients.length && (
          <main className={styles.container}>
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients />
              <BurgerConstructor />
            </DndProvider>
          </main>)
      }
      {
        modalIsOpen && modalType === "ingredientDetails" ? (
            <Modal
              extraClass={modalStyles.ingredient}
              title="Детали ингредиента"
            >
              <IngredientDetails />
            </Modal>)
          :
          modalIsOpen && modalType === "orderDetails" ?
            (
              <Modal
                extraClass={modalStyles.order}
              >
                <OrderDetails />
              </Modal>)
            :
            null
      }
    </div>
  );
}

export default App;
