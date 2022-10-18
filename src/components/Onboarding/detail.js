import { useState } from "react"
import cn from 'classnames';
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Sigil from "../sigil";

export default function PayDetailScreen() {
    const { planet, credit, setCredit } = useOutletContext();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: credit ? credit : {},
    });
    const email = watch('email');

    const navigate = useNavigate();

    return <div className="grow flex justify-center items-center text-white">
        <div className="flex space-x-12">
            <div className="flex flex-col space-y-8 items-center">
                <p>Reserved for 15 minutes</p>
                <div className="rounded-xl overflow-hidden">
                    <Sigil patp={planet || "~zod"} color="#6184FF" />
                </div>
                <p>{planet}</p>
            </div>
            <form
                className="flex-col space-y-4"
                onSubmit={handleSubmit((data) => {
                    setCredit(data);
                    navigate('/new/pay');
                })}
            >
                <p>Full name</p>
                <input
                    className={cn("w-full p-3 border-b bg-transparent border-white",
                        {"border-red-500": !!errors?.name}
                    )}
                    type="text"
                    placeholder="John Smith"
                    autoComplete="cc-given-name"
                    id="name"
                    aria-invalid={!!errors?.name}
                    {...register('name', {
                        required: true,
                        minLength: 1,
                        pattern: {
                            value: /(?:(\w+-?\w+)) (?:(\w+))(?: (\w+))?$/,
                            message: 'Full name as it appears on your credit card',
                        },
                    })}
                />
                <p>Billing address</p>
                <input
                    className={cn("w-full p-3 border-b bg-transparent border-white",
                        {"border-red-500": !!errors?.line1}
                    )}
                    type="text"
                    placeholder="200 Cherry Ln"
                    autoComplete="address-level1"
                    id="address1"
                    aria-invalid={!!errors?.line1}
                    {...register('line1', { required: true })}
                />
                <input
                    className="w-full p-3 border-b bg-transparent"
                    type="text"
                    placeholder="Apt G"
                    autoComplete="address-level2"
                    id="address2"
                    {...register('line2')}
                />
                <p>City</p>
                <input
                    className={cn("w-full p-3 border-b bg-transparent border-white",
                        {"border-red-500": !!errors?.city}
                    )}
                    type="text"
                    placeholder="Verduria"
                    id="city"
                    aria-invalid={!!errors?.city}
                    {...register('city', { required: true })}
                />
                <div className="flex justify-between">
                    <div className="flex flex-col space-y-2">
                        <p>State</p>
                        <input
                            className={cn("w-full p-3 border-b max-w-[4rem] bg-transparent border-white",
                                {"border-red-500": !!errors?.state}
                            )}
                            type="text"
                            placeholder="MN"
                            autoComplete="address-level1"
                            id="state"
                            aria-invalid={!!errors?.state}
                            {...register('state', {
                                required: true,
                                maxLength: 2,
                            })}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p>Postal code</p>
                        <input
                            className={cn("w-full p-3 border-b bg-transparent border-white",
                                {"border-red-500": !!errors?.postal}
                            )}
                            type="text"
                            placeholder="88888"
                            autoComplete="postal-code"
                            id="postal"
                            aria-invalid={!!errors?.postal}
                            {...register('postal', {
                                required: true,
                                minLength: 5,
                                maxLength: 5,
                            })}
                        />
                    </div>
                </div>
                <p>Email address</p>
                <input
                    className={cn("w-full p-3 border-b bg-transparent border-white",
                        {"border-red-500": errors?.email}
                    )}
                    type="email"
                    placeholder="john@apple.seed"
                    id="email"
                    aria-invalid={!!errors?.email}
                    {...register('email', { required: true })}
                />
                <p>Confirm email address</p>
                <input
                    className="w-full p-3 border-b bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                    placeholder="john@apple.seed"
                    required
                    type="email"
                    pattern={email}
                />
                <div className="flex justify-center">
                    <button className="mt-8 cursor-pointer block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white hover:brightness-110 text-xl text-center">Continue</button>
                </div>
                {Object.keys(errors).length > 0 && (
                    <p className="text-red-600">
                        Please ensure all fields are correct.
                    </p>
                )}
            </form>
        </div>
    </div>
}
