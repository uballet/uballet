import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import uballet from "../../api/uballet";
import { Contact } from "../../api/uballet/types";

const useDeleteContact = () => {
  const queryClient = useQueryClient();

  const deleteContact = useCallback(
    async ({ contactId }: { contactId: string }) => {
      const id = contactId;
      const contact = await uballet.deleteContact({ id });
      return contact;
    },
    []
  );

  const {
    mutate: deleteContactMutate,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: deleteContact,
    onSuccess(_, { contactId }) {
      queryClient.setQueryData(
        ["contacts"],
        (contacts: Contact[] | undefined) =>
          (contacts ?? []).filter((contact) => contact.id !== contactId)
      );
    },
  });

  return {
    deleteContactMutate,
    isPending,
    isSuccess,
  };
};

export { useDeleteContact };
