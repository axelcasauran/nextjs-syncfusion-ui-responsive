/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertIcon, AlertTitle } from "@reui/ui/alert";
import { RiCheckboxCircleFill, RiErrorWarningFill } from "@remixicon/react";
import { toast } from "sonner";

interface GridBatchChanges<T> {
  addedRecords: T[];
  changedRecords: T[];
  deletedRecords: T[];
}

interface GridRef {
  getBatchChanges(): GridBatchChanges<unknown>;
  editModule: {
    endEdit(): void;
  };
}

interface SaveChangesProps<T, R> {
  gridRef: React.RefObject<GridRef>;
  setFormPage: (data: R) => void;
  apiGet: string;
  apiUpdate: string;
  Entity: string;
}

export const saveChanges = async <T, R>({ 
  gridRef, 
  setFormPage, 
  apiGet, 
  apiUpdate, 
  Entity 
}: SaveChangesProps<T, R>) => {
  if (!gridRef.current) return;

  const batchChanges = gridRef.current.getBatchChanges();
  if (!batchChanges || (!batchChanges.addedRecords.length && !batchChanges.changedRecords.length && !batchChanges.deletedRecords.length)) {
    gridRef.current.editModule.endEdit();
    return;
  }

  try {
    const response = await fetch(apiUpdate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchChanges),
    });

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
    } else {
      toast.custom(() => (
        <Alert variant="mono" icon="destructive">
          <AlertIcon>
            <RiErrorWarningFill />
          </AlertIcon>
          <AlertTitle>Error updating {Entity}</AlertTitle>
        </Alert>
      ));
    }
  } catch (error) {
    console.error('Save changes failed:', error);
    toast.custom(() => (
      <Alert variant="mono" icon="destructive">
        <AlertIcon>
          <RiErrorWarningFill />
        </AlertIcon>
        <AlertTitle>Error: {error instanceof Error ? error.message : 'Unknown error'}</AlertTitle>
      </Alert>
    ));
  }
};
