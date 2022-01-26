import { createSlice } from "@reduxjs/toolkit";

/**
 * The statistical values that are computable are listed here as
 * an "enum"
 */
export const STATISTICAL_VALUES = {
    mean: "mean",
    median: "median",
    derivative: "derivative",
    percentile: "percentile",
}

/**
 * The same statistical values as a list to verify certain payload data
 */
const STATISTICAL_VALUES_LIST = Object.values(STATISTICAL_VALUES);

/**
 * This object serves as a template, whenever a new model is added to a group
 * this object describes the default settings of the freshly added model.
 */
const MODEL_DATA_TEMPLATE = {   // single model
    color: null,                // if not set it defaults to standard value from api
    isVisible: true,            // show/hide individual models from a group
    mean: true,
    derivative: true,
    median: true,
    percentile: true,
}


const MODEL_GROUP_TEMPLATE = { 
    name: "",
    modelList: [],
    models: {},         // models is lookup table
    isVisible: true,    // show/hide complete group
    visibileSV: {       // lookup table so the reducer impl. can be more convenient
        mean: true,
        derivative: true,
        median: true,
        percentile: true,
    }
}

/**
 * The initial state of the modelSlice defines the data structure in the 
 * store. Each plot has its own data i.e. have separate model(groups).
 * 
 * IF you change this initial state you have to adapt the first test in the
 * corresponding test file, that tests the initial state.
 */
const initialState = {
    idCounter: 1,
    modelGroupList: [0],
    // currently active plot
    modelGroups: {
        // this objects holds key-value-pairs, the keys being the model-group 
        // identifier and the values being the settings for each group 
        0: { 
            name: "Example Group",
            // model group storing all information until it is possible 
            // to implement more model groups
            modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
            models: { // models is lookup table
                "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                    color: null, // if not set it defaults to standard value from api
                    isVisible: true, // show/hide individual models from a group
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            },
            isVisible: false, // show/hide complete group
            visibileSV: { // lookup table so the reducer impl. can be more convenient
                mean: true,
                derivative: true,
                median: true,
                percentile: true,
            }
        }
    },
}

/**
 * The modelSlice is generated by the redux toolkit. The reducers are defined here
 * and the corresponding actions are auto-generated.
 */
const modelsSlice = createSlice({
    name: "models",
    initialState,
    reducers: {

        /**
         * This reducer accepts an action object returned from setModelsOfModelGroup()
         * 
         *      e.g. dispatch(setModelsOfModelGroup({
         *              groupId: 0, 
         *              modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2", "CCMI-1_CCCma_CMAM-refC2"]
         *      }))
         * 
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * This method provides a convenient interface for the AddModelGroupModal
         * by allowing to dispatch a groupId with the required models. If
         * the group already exists the corresponding data is updated otherwise
         * the reducer TAKES CARE of creating a group.
         * 
         * @param {object} state the current store state of: state/models
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {int} action.payload.groupId the name of the group to set
         * @param {string} action.payload.groupName the name of the group
         * @param {string} action.payload.modelList the list of models the group should have
         */
        setModelsOfModelGroup(state, action) { 
            const { groupId, groupName, modelList } = action.payload;
            // set model group
            if (state.modelGroupList.includes(groupId)) {
                const selectedModelGroup = state.modelGroups[groupId];
                state.modelGroups[groupId].name = groupName;
                // remove unwanted
                const toDelete = selectedModelGroup.modelList.filter(model => !modelList.includes(model));
                
                toDelete.forEach( // delete from lookup table
                    model => delete selectedModelGroup.models[model]
                );
                // filter out from list
                selectedModelGroup.modelList = selectedModelGroup.modelList.filter(model => !toDelete.includes(model));  
                
                // add new ones
                for (let model of modelList) {
                    if (!selectedModelGroup.modelList.includes(model)){ // initialize with default settings
                        selectedModelGroup.modelList.push(model);
                        selectedModelGroup.models[model] = Object.assign({}, MODEL_DATA_TEMPLATE);
                    }
                };
                
            } else { // create new group
                const newGroupId = state.idCounter++;
                state.modelGroupList.push(newGroupId);
                state.modelGroups[newGroupId] = Object.assign({}, MODEL_GROUP_TEMPLATE);
                state.modelGroups[newGroupId].name = groupName;
                const currentGroup = state.modelGroups[newGroupId];
                for (let model of modelList) {
                    currentGroup.modelList.push(model);
                    currentGroup.models[model] = Object.assign({}, MODEL_DATA_TEMPLATE);
                };

            }
            // change name either way
            
        }, 

        /**
         * This reducer accepts an action object returned from deleteModelGroup()
         * 
         *      e.g. dispatch(deleteModelGroup({0: "refC2"}))
         * 
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * This method provides a convenient interface for the AddModelGroupModal
         * by allowing to dispatch a groupId with the required models. If
         * the group already exists the corresponding data is updated otherwise
         * the reducer takes care of creating a group.
         * 
         * @param {object} state the current store state of: state/models
         * @param {object} action accepts the action returned from deleteModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {int} action.payload.groupId the name of the group that should be deleted
         */
        deleteModelGroup(state, action) {
            const { groupId } = action.payload;
            if (!state.modelGroupList.includes(groupId)) { // no group with this name in store
                throw `tried to access "${groupId}" which is not a valid group`;
            };

            state.modelGroupList = state.modelGroupList.filter(name => name !== groupId); // filter out name
            delete state.modelGroups[groupId]; // delete from lookup table

        },
        
        /**
         * This reducer accepts an action object returned from updatePropertiesOfModelGroup()
         * 
         *      e.g. dispatch(setStatisticalValueForGroup(
         *          { groupID: 42, data: bigObject }
         *      ));
         * 
         * This method provides an interface to update the properties of an existing model
         * group. The properties are whether the model is included in the statistical value(s)
         * and whether the model is visible.
         * 
         * @param {object} state the current store state of: state/models
         * @param {object} action accepts the action returned from deleteModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {int} action.payload.groupId the name of the group whose model properties should be updated
         * @param {object} action.payload.data holds the information that should be updated 
         */
        updatePropertiesOfModelGroup(state, action) {
            const { groupId, data } = action.payload;

            if (!state.modelGroupList.includes(groupId)) { // no group with this name in store
                throw `tried to access "${groupId}" which is not a valid group`;
            };

            for (let model of state.modelGroups[groupId].modelList) {
                const { color, mean, median, derivative, percentile, isVisible } = data[model]; // expect data to meet certain scheme
                state.modelGroups[groupId].models[model] = {
                    color,
                    mean,
                    median,
                    derivative,
                    percentile,
                    isVisible,
                };
            };
        },

        /**
         * This reducer accepts an action object returned from setStatisticalValueForGroup()
         *      e.g. dispatch(setStatisticalValueForGroup(
         *          {groupID: 0, svType: STATISTICAL_VALUES.median, isIncluded: true}
         *      ));
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case for a given group is set whether the given statistical values (SV)
         * should be displayed.
         * 
         * @param {object} state the current store state of: state/models
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {int} action.payload.groupId a string specifying the group
         * @param {string} action.payload.svType the SV as a string
         * @param {boolean} action.payload.isIncluded should the SV be displayed for the given group
         */
        setStatisticalValueForGroup(state, action) { // this is for an entire group
            const { groupId, svType, isIncluded } = action.payload;
            
            if (!STATISTICAL_VALUES_LIST.includes(svType)) { // svType doesn't represent a valid statistical value
                throw `tried to set statistial value "${svType}" that is not a valid statistical value (${STATISTICAL_VALUES_LIST.join("|")})`;
            }
            if (!state.modelGroupList.includes(groupId)) { // no group with this name in store
                throw `tried to access "${groupId}" which is not a valid group`;
            };

            state.modelGroups[groupId].visibileSV[svType] = isIncluded;
        },

        /**
         * This reducer accepts an action object returned from setVisibilityForGroup()
         *      e.g. dispatch(setVisibilityForGroup(
         *          {groupID: 0, isVisibile: true}
         *      ));
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case for a given group is set whether it should be visibile or not.
         * 
         * @param {object} state the current store state of: state/models
         * @param {object} action accepts the action returned from updateModelGroup()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {int} action.payload.groupId a string specifying the group
         * @param {string} action.payload.svType the SV as a string
         * @param {boolean} action.payload.isIncluded should the SV be displayed for the given group
         */
        setVisibilityForGroup(state, action) { // this is for an entire group
            const { groupId, isVisible } = action.payload;

            if (!state.modelGroupList.includes(groupId)) {
                throw `tried to access "${groupId}" which is not a valid group`;
            };

            state.modelGroups[groupId].isVisible = isVisible;
        },
    }
})

/**
 * The here listed actions are exported and serve as an interface for
 * the view (our react components).
 */
export const { 
    setModelsOfModelGroup,
    deleteModelGroup,
    updatePropertiesOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup,
} = modelsSlice.actions;

/**
 * The reducer combining all reducers defined in the plot slice. 
 * This has to be included in the redux store, otherwise dispatching 
 * the above defined actions wouldn't trigger state updates.
 */
export default modelsSlice.reducer;
/**
 * This selector allows components to select the models of a given group (specified by ID)
 *
 * @param {object} state the global redux state
 * @param {int} groupId the group id specifies which group should be retrieved
 * @returns an array containg all models currently in the given group
 */
export const selectModelsOfGroup = (state, groupId) => state.models.modelGroups[groupId].modelList;
/**
 * This selector allows components to select the model data of a given group (specified by ID)
 * 
 * @param {object} state the global redux state
 * @param {int} groupId the group id specifies which group data should be retrieved
 * @returns an object containg all the data for each model present in the group. The model names are the keys.
 */
export const selectModelDataOfGroup = (state, groupId) => state.models.modelGroups[groupId].models;
/**
 * This selector allows components to select the name of a given group (specified by ID)
 * 
 * @param {object} state the global redux state
 * @param {int} groupId the group id specifies which group name should be retrieved
 * @returns a string that holds the name of the group
 */
export const selectNameOfGroup = (state, groupId) => state.models.modelGroups[groupId].name;
/**
 * This selector allows components to select the statistical values of a given group (specified by ID)
 * 
 * @param {object} state the global redux state
 * @param {int} groupId the group id specifies which data should be retrieved
 * @returns an object that maps each statistical value onto a boolean
 */
export const selectStatisticalValueSettingsOfGroup = (state, groupId) => state.models.modelGroups[groupId].visibileSV;
/**
 * This selector allows components to select the visibility of a given group (specified by ID)
 * 
 * @param {object} state the global redux state
 * @param {int} groupId the group id specifies which data should be retrieved
 * @returns boolean value whether the group is visible or not
 */
export const selectVisibilityOfGroup = (state, groupId) => state.models.modelGroups[groupId].isVisible;
/**
 * This selector allows components to select all valid group ids
 * 
 * @param {object} state the global redux state
 * @returns an array holding all valid group ids
 */
export const selectAllGroupIds = state => state.modelGroupList;