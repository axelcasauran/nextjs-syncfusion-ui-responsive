/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, AlertIcon, AlertTitle } from "@reui/ui/alert";
import { RiCheckboxCircleFill, RiErrorWarningFill } from "@remixicon/react";
import { toast } from "sonner";

export const saveChanges = async (gridRef: React.RefObject<any>, setFormPage: any, apiGet: string, apiUpdate: string, Entity: string) => {
    const batchChanges = gridRef.current.getBatchChanges();
    if (!batchChanges || (!batchChanges.addedRecords.length && !batchChanges.changedRecords.length && !batchChanges.deletedRecords.length)) {
        gridRef.current.editModule.endEdit();
        return;
    }

    const response = await fetch(apiUpdate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchChanges),
    });

    console.log(response);
    if (response.ok) {
        const refreshResponse = await fetch(apiGet);
        const newData = await refreshResponse.json();
        setFormPage(newData.result);

        toast.custom(() => (
            <Alert variant="mono" icon="success">
                <AlertIcon>
                    <RiCheckboxCircleFill />
                </AlertIcon>
                <AlertTitle>{Entity} updated successfully</AlertTitle>
            </Alert>
        ));

    }
    else {
        toast.custom(() => (
            <Alert variant="mono" icon="destructive">
                <AlertIcon>
                    <RiErrorWarningFill />
                </AlertIcon>
                <AlertTitle>error</AlertTitle>
            </Alert>
        ));
    }
};
