import { defineStepper } from "@stepperize/react";

export const checkoutStepper = defineStepper([
    { id: "variants" },
    { id: "plan" },
    { id: "allocation" },
    { id: "checkout" },
]);
