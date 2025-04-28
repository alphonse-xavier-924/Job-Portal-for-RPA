let { body, oneOf, check } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  isString(path) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .isString()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
  isNumber(path) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .isNumeric()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
  requiredObjectId(path, optional = false) {
    return body(path)
      .custom((value) => {
        if (optional && value === undefined) {
          return true;
        }
        return ObjectId.isValid(value);
      })
      .withMessage(`Please provide a valid ${path}`);
  },
  requiredObjectIdOptional(path, optional = false) {
    return body(path)
      .optional()
      .custom((value) => {
        if (optional && value === undefined) {
          return true;
        }
        return ObjectId.isValid(value);
      })
      .withMessage(`Please provide a valid ${path}`);
  },
  required(path) {
    return body(path)
      .exists({
        checkNull: true,
      })
      .withMessage(`${path} is required`);
  },
  requiredArray(path) {
    return body(path)
      .exists({
        checkNull: true,
      })
      .withMessage(`${path} is required`)
      .isArray()
      .withMessage(`${path} must be an array`);
  },
  requiredArrayWithLength(path, minLength, maxLength) {
    return body(path)
      .exists({
        checkNull: true,
      })
      .withMessage(`${path} is required`)
      .isArray()
      .withMessage(`${path} must be an array`)
      .isArray({
        min: minLength,
      })
      .withMessage(`${path} length must be minimum ${minLength}`)
      .isArray({
        max: maxLength,
      })
      .withMessage(`${path} length must be maximum ${maxLength}`);
  },
  requiredArrayofString(path) {
    return body(path)
      .exists({ checkNull: true })
      .withMessage(`${path} is required`)
      .isArray({ min: 1 })
      .withMessage(`${path} must be a non-empty array`)
      .custom((value) => {
        if (!value.every((item) => typeof item === "string")) {
          throw new Error(`${path} must contain only strings`);
        }
        return true;
      });
  },
  requiredArrayWithLengthOptional(path, minLength, maxLength) {
    return body(path)
      .optional()
      .isArray()
      .withMessage(`${path} must be an array`)
      .isArray({
        min: minLength,
      })
      .withMessage(`${path} length must be minimum ${minLength}`)
      .isArray({
        max: maxLength,
      })
      .withMessage(`${path} length must be maximum ${maxLength}`);
  },
  isStringOptional(path) {
    return body(path)
      .isString()
      .optional()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
  isNumberOptional(path) {
    return body(path)
      .isNumeric()
      .optional()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
  isBoolean(path) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .isBoolean()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
  isBooleanOptional(path) {
    return body(path)
      .isBoolean()
      .optional()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
  page(path) {
    return body(path)
      .isInt({
        min: 1,
      })
      .withMessage("Please provide a valid page");
  },
  perPage(path, min = 10, max = 30) {
    return body(path)
      .isInt({
        min: min,
        max: max,
      })
      .withMessage("Please provide a valid per page");
  },
  isStringOptionalNotEmpty(path) {
    return body(path)
      .isString()
      .optional()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      )
      .trim()
      .notEmpty()
      .withMessage(`${path} is empty`);
  },
  isStringNotEmpty(path) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .isString()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      )
      .trim()
      .notEmpty()
      .withMessage(`${path} is empty`);
  },
  isValid(path, payload) {
    return check(path)
      .isIn(payload)
      .withMessage(
        `${
          path.split(".")[1] ? path.split(".")[1] : path
        } accept only ${payload}`
      );
  },
  isValidOptional(path, payload) {
    return check(path)
      .optional()
      .isIn(payload)
      .withMessage(
        `${
          path.split(".")[1] ? path.split(".")[1] : path
        } accept only ${payload}`
      );
  },
  isValidMobile(path) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .matches(/^\+[0-9]{2}[0-9]{10}$/)
      .withMessage(
        `${
          path.split(".")[1] ? path.split(".")[1] : path
        } is invalid mobile number`
      )
      .notEmpty()
      .withMessage(`${path} is empty`);
  },
  isStringWithMinLen(path, len) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .isString()
      .isLength({
        min: len,
      })
      .trim()
      .notEmpty()
      .withMessage(
        `${
          path.split(".")[1] ? path.split(".")[1] : path
        } requires min length ${len}`
      );
  },
  isStringWithMinLenOptional(path, len) {
    return body(path)
      .optional()
      .isString()
      .isLength({
        min: len,
      })
      .trim()
      .notEmpty()
      .withMessage(
        `${
          path.split(".")[1] ? path.split(".")[1] : path
        } requires min length ${len}`
      );
  },
  isNumberWithMinLen(path, len) {
    return body(path)
      .exists()
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is required`
      )
      .isNumeric()
      .isLength({
        min: len,
      })
      .withMessage(
        `${path.split(".")[1] ? path.split(".")[1] : path} is incorrect type`
      );
  },
};
