const validateUpdateRequest = (req, res, next) => {
    if(req.path == '/update-task'){
        const expectedFields = ['status','due_date'];
        const hasUnexpected = hasUnexpectedFields(req.body, expectedFields);
        if (hasUnexpected) {
            return res.status(400).send(`Unexpected field(s) in request body : attempt to modify immutable fields`);
        }
        if(req.body.due_date < Date.now()){
            return res.status(400).send(`Invalid due_date: date value in the past`);
        }
        if(!req.body.due_date && !req.body.status){
            return res.status(400).send(`Nothing to update`);
        }
    }
    if(req.path == '/update-subTask'){
        const expectedFields = ['status'];
        const hasUnexpected = hasUnexpectedFields(req.body, expectedFields);
        if (hasUnexpected) {
            return res.status(400).send(`Unexpected field(s) in request body : attempt to modify immutable fields`);
        }
    }
    if(req.body.hasOwnProperty('title')){
    }
    else {
        next();
    }
}

function hasUnexpectedFields(obj, expectedFields) {
    const objKeys = Object.keys(obj);
    const expectedKeys = new Set(expectedFields);
  
    // Check if there are keys in the object that are not in the expected set
    const unexpectedKeys = objKeys.filter(key => !expectedKeys.has(key));
  
    return unexpectedKeys.length > 0;
  }

const validateMobile = (mobileNo)=>{
    const regex = /^(?:\+91)?[6-9]\d{9}$/;
    return regex.test(mobileNo);
}
module.exports = {
    validateUpdateRequest,
    validateMobile
};