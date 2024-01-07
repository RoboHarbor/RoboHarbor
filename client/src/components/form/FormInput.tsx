import { useState, InputHTMLAttributes } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';

import { FieldErrors, Control } from 'react-hook-form';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
    endIcon?: boolean;
    label?: string;
    type?: string;
    name: string;
    comp?: string;
    placeholder?: string;
    register?: any;
    errors?: FieldErrors;
    control?: Control<any>;
    className?: string;
    labelClassName?: string;
    containerClass?: string;
    textClassName?: string;
    refCallback?: any;
    action?: React.ReactNode;
    rows?: number;
};

/* Password Input with addons */
const PasswordInput = ({
    name,
    placeholder,
    refCallback,
    errors,
    control,
    register,
    className,
    ...otherProps
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <>
            <InputGroup className="mb-0">
                <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    name={name}
                    id={name}
                    as="input"
                    ref={(r: HTMLInputElement) => {
                        if (refCallback) refCallback(r);
                    }}
                    className={className}
                    isInvalid={errors && errors[name] ? true : false}
                    {...(register ? register(name) : {})}
                    autoComplete={name}
                    {...otherProps}
                />
                <div
                    className={classNames('input-group-text', 'input-group-password', {
                        'show-password': showPassword,
                    })}
                    data-password={showPassword ? 'true' : 'false'}
                >
                    <span
                        className="password-eye"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                    ></span>
                </div>
            </InputGroup>

            {errors && errors[name] ? (
                <Form.Control.Feedback type="invalid" className="d-block">
                    {errors[name]['message']}
                </Form.Control.Feedback>
            ) : null}
        </>
    );
};

// textual form-controls—like inputs, passwords, textareas etc.
const TextualInput = ({
    type,
    name,
    placeholder,
    endIcon,
    register,
    errors,
    comp,
    rows,
    className,
    refCallback,
    ...otherProps
}: FormInputProps) => {
    return (
        <>
            {type === 'password' && endIcon ? (
                <>
                    <PasswordInput
                        name={name}
                        placeholder={placeholder}
                        refCallback={refCallback}
                        errors={errors!}
                        register={register}
                        className={className}
                        {...otherProps}
                    />
                </>
            ) : (
                <>
                    <Form.Control
                        type={type}
                        placeholder={placeholder}
                        name={name}
                        as={comp}
                        id={name}
                        ref={(r: HTMLInputElement) => {
                            if (refCallback) refCallback(r);
                        }}
                        className={className}
                        isInvalid={errors && errors[name] ? true : false}
                        {...(register ? register(name) : {})}
                        rows={rows}
                        {...otherProps}
                    ></Form.Control>

                    {errors && errors[name] ? (
                        <Form.Control.Feedback type="invalid" className="d-block">
                            {errors[name]['message']}
                        </Form.Control.Feedback>
                    ) : null}
                </>
            )}
        </>
    );
};

// non-textual checkbox and radio controls
const CheckInput = ({
    type,
    label,
    name,
    placeholder,
    register,
    errors,
    comp,
    rows,
    className,
    refCallback,
    ...otherProps
}: FormInputProps) => {
    return (
        <>
            <Form.Check
                type={type}
                label={label}
                name={name}
                id={name}
                ref={(r: HTMLInputElement) => {
                    if (refCallback) refCallback(r);
                }}
                className={className}
                isInvalid={errors && errors[name] ? true : false}
                {...(register ? register(name) : {})}
                {...otherProps}
            />

            {errors && errors[name] ? (
                <Form.Control.Feedback type="invalid" className="d-block">
                    {errors[name]['message']}
                </Form.Control.Feedback>
            ) : null}
        </>
    );
};

// handle select controls
const SelectInput = ({
    type,
    label,
    name,
    placeholder,
    register,
    errors,
    comp,
    className,
    children,
    refCallback,
    ...otherProps
}: FormInputProps) => {
    return (
        <>
            <Form.Select
                type={type}
                label={label}
                name={name}
                id={name}
                ref={(r: HTMLInputElement) => {
                    if (refCallback) refCallback(r);
                }}
                children={children}
                className={className}
                isInvalid={errors && errors[name] ? true : false}
                {...(register ? register(name) : {})}
                {...otherProps}
            />

            {errors && errors[name] ? (
                <Form.Control.Feedback type="invalid">{errors[name]['message']}</Form.Control.Feedback>
            ) : null}
        </>
    );
};

const FormInput = ({
    label,
    type,
    name,
    placeholder,
    endIcon,
    register,
    errors,
    control,
    className,
    labelClassName,
    containerClass,
    refCallback,
    children,
    action,
    rows,
    ...otherProps
}: FormInputProps) => {
    // handle input type
    const comp = type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input';

    const hasEndIcon = endIcon !== undefined ? endIcon : true;

    return (
        <>
            {type === 'hidden' ? (
                <input type={type} name={name} {...(register ? register(name) : {})} {...otherProps} />
            ) : (
                <>
                    {type === 'select' ? (
                        <Form.Group className={containerClass}>
                            {label ? (
                                <>
                                    <Form.Label className={labelClassName}>{label}</Form.Label>
                                    {action && action}
                                </>
                            ) : null}

                            <SelectInput
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                refCallback={refCallback}
                                errors={errors}
                                register={register}
                                comp={comp}
                                className={className}
                                children={children}
                                {...otherProps}
                            />
                        </Form.Group>
                    ) : (
                        <>
                            {type === 'checkbox' || type === 'radio' ? (
                                <Form.Group className={containerClass}>
                                    <CheckInput
                                        type={type}
                                        label={label}
                                        name={name}
                                        placeholder={placeholder}
                                        refCallback={refCallback}
                                        errors={errors}
                                        register={register}
                                        comp={comp}
                                        className={className}
                                        rows={rows}
                                        {...otherProps}
                                    />
                                </Form.Group>
                            ) : (
                                <Form.Group className={containerClass}>
                                    {label ? (
                                        <>
                                            <Form.Label className={labelClassName}>{label}</Form.Label>
                                            {action && action}
                                        </>
                                    ) : null}

                                    <TextualInput
                                        type={type}
                                        name={name}
                                        placeholder={placeholder}
                                        endIcon={hasEndIcon}
                                        refCallback={refCallback}
                                        errors={errors}
                                        register={register}
                                        comp={comp}
                                        className={className}
                                        rows={rows}
                                        {...otherProps}
                                    />
                                </Form.Group>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default FormInput;
