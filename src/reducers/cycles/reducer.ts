import { produce } from 'immer'

import { Cycle } from '../../contexts/CyclesContext'
import { ActionTypes } from './actions'

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

interface ActionsType {
  type: ActionTypes
  payload?: {
    newCycle: Cycle
  }
}

export function cyclesReducer(state: CyclesState, action: ActionsType) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        if (action.payload) {
          draft.cycles.push(action.payload.newCycle)
          draft.activeCycleId = action.payload.newCycle.id
        }
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })
      if (currentCycleIndex < 0) {
        return state
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })
      if (currentCycleIndex < 0) {
        return state
      }
      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}
