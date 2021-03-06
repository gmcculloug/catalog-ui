import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import { fetchWorkflows } from '../../../redux/actions/approval-actions';
import { ASYNC_ACTIONS } from '../../../redux/action-types/approval-action-types';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

describe('approval actions', () => {

  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should dispatch correct actions after fetching workflows', () => {
    const store = mockStore({});
    const expectedActions = [{
      type: ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING
    }, {
      payload: [{
        label: 'workflow',
        value: '123'
      }],
      type: ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED
    }];

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));

    return store.dispatch(fetchWorkflows()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

