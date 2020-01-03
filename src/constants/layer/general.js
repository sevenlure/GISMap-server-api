import * as _ from 'lodash'

const _keyGeneral = {
  FOOD_N_DRINK: {
    key: 'GENERAL/FOOD_N_DRINK',
    name: 'Food & Drink'
  },
  SHOPPING: {
    key: 'GENERAL/SHOPPING',
    name: 'Shopping'
  },
  HEALTH_N_BEAUTY: {
    key: 'GENERAL/HEALTH_N_BEAUTY',
    name: 'Health & Beauty'
  },
  ENTERTAINMENT_N_LEISURE: {
    key: 'GENERAL/ENTERTAINMENT_N_LEISURE',
    name: 'Entertainment & Leisure'
  },
  SERVICES: {
    key: 'GENERAL/SERVICES',
    name: 'Services'
  },
  ADMINISTRATIVE: {
    key: 'GENERAL/ADMINISTRATIVE',
    name: 'Administrative'
  },
  OUTDOOR_N_SPORTS: {
    key: 'GENERAL/OUTDOOR_N_SPORTS',
    name: 'Outdoor & Sports'
  },
  TRANSPORT: {
    key: 'GENERAL/TRANSPORT',
    name: 'Transport'
  },
  ACADEMIES_N_EDUCATION: {
    key: 'GENERAL/ACADEMIES_N_EDUCATION',
    name: 'Academies & Education'
  },
  ACCOMMODATION: {
    key: 'GENERAL/ACCOMMODATION',
    name: 'Accomodation'
  },
  RELIGION: {
    key: 'GENERAL/RELIGION',
    name: 'Religion'
  },
  UNCATEGORIZED_MARKERS: {
    key: 'GENERAL/UNCATEGORIZED_MARKERS',
    name: 'Uncategorized'
  }
}

export const _keyArr = _.map(_keyGeneral, 'key')

export default _keyGeneral
