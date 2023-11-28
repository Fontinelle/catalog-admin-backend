import { validateSync, ValidationError } from 'class-validator';
import { FieldsErrors, IValidatorFields } from './validator-fields-interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  errors: FieldsErrors | null = null;
  validatedData: PropsValidated | null = null;

  validate(data: any) {
    const errors = validateSync(data);

    if (errors.length) {
      this.errors = {};
      errors.forEach(error => {
        const { property, constraints } = error;
        this.errors[property] = Object.values(constraints);
      });
    } else {
      this.validatedData = data;
    }

    return errors;
  }
}
