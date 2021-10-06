import { useState, useEffect } from 'react'

import { FoodObject } from '../../@types/types'

import Header from '../../components/Header'
import api from '../../services/api'
import Food from '../../components/Food'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'

function Dashboard(): JSX.Element {
  const [foods, setFoods] = useState<FoodObject[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodObject)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)

  useEffect(() => {
    async function loadFoods() {
      const foods = await api.get('/foods')
      setFoods(foods.data)
    }

    loadFoods()
  }, [])

  async function handleAddFood(food: FoodObject) {
    try {
      const addedFood = await api.post('/foods', {
        ...food,
        available: true,
      })
      setFoods([...foods, addedFood.data])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdateFood(food: FoodObject) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food })
      const foodsUpdated = foods.map((food) =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      )

      setFoods(foodsUpdated)
    } catch (error) {
      console.log(error)
    }
  }

  function handleEditFood(food: FoodObject) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter((restOfFood) => restOfFood.id !== id)

    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood isOpen={modalOpen} setIsOpen={toggleModal} handleAddFood={handleAddFood} />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard
