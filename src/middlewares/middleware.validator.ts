import { validate, ValidationError } from 'class-validator'
import { ClassConstructor, plainToClass } from 'class-transformer'
import status from 'http-status'
import { Request, Response, NextFunction, Handler } from 'express'
import { OutgoingMessage } from 'http'

import { apiResponse } from '@helpers/helper.apiResponse'
import { Middleware } from '@helpers/helper.di'

@Middleware()
export class ValidatorMiddleware {
  use(MetaType: ClassConstructor<any>): Handler {
    return async function (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> {
      let property: Record<string, any> = {}

      Object.assign(property, req.body, req.params, req.query)

      const object: Record<string, any> = plainToClass(MetaType, property)
      const errorsResponse: ValidationError[] = await validate(object)

      const errorMessage = errorsResponse.map((val: ValidationError) => apiResponse({ stat_code: status.BAD_REQUEST, err_message: Object.values(val.constraints)[0] }))
      if (errorMessage.length) {
        return res.status(status.BAD_REQUEST).json({ errors: errorMessage })
      }

      next()
    }
  }
}
