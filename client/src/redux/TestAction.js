import * as ActionTypes from './ActionTypes';

export const Tests = (state = {
        isLoading: true,
        errMess: null,
        tests: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.FETCH_TESTS:
            return {...state, isLoading: false, errMess: null, tests: action.payload};

        case ActionTypes.FETCH_TESTS_LOADING:
            return {...state, isLoading: true, errMess: null, tests: []};

        case ActionTypes.FETCH_TESTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, tests: []};
        default:
            return state;
    }
}
export const Test =(state={
    isLoading: true,
    errMess: null,
    test: {
        duration: 10,
        questions: [
          {
            id: 0,
            number:1,
            question: 'Sum of two even natural numbers is: ',
            option1: 'even',
            option2: 'odd',
            option3: 'transcendental',
            option4: 'fraction',
            answer: 'option1'
          },
          {
            id: 1,
            number:2,
            question: 'Pi is : ',
            option1: 'irrational',
            option2: 'rational',
            option3: 'transcendental',
            option4: 'Mersenne prime',
            answer: 'option3'
          },
          {
            id: 2,
            number:3,
            question: 'Strongest Fundamental Forces of Nature: ',
            option1: 'Strong Nuclear Forces',
            option2: 'Weak Nuclear Forces',
            option3: 'Gravitational Forces',
            option4: 'Electromagnetic Forces',
            answer: 'option1'
          },
          {
            id: 3,
            number:4,
            question: 'Electromagnetic Fields Force Carrier is: ',
            option1: 'Photon',
            option2: 'Higgs Boson',
            option3: 'Graviton',
            option4: 'Gluon',
            answer: 'option1'
          }
      
        ]
    }
},action)=>{
    switch(action.type) {
        case ActionTypes.FETCH_TEST:
            return {...state, isLoading: false, errMess: null, tests: action.payload};

        case ActionTypes.FETCH_TEST_LOADING:
            return {...state, isLoading: true, errMess: null, tests: []};

        case ActionTypes.FETCH_TEST_FAILED:
            return {...state, isLoading: false, errMess: action.payload, tests: []};
        default:
            return state;

}
}