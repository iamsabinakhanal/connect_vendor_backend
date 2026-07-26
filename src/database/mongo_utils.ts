export const toDomain = <T extends { _id: string }>(document: T): Omit<T, "_id"> & { id: string } => {
  const { _id, ...rest } = document;
  return {
    id: _id,
    ...rest
  };
};

export const toDomainList = <T extends { _id: string }>(documents: T[]): Array<Omit<T, "_id"> & { id: string }> => {
  return documents.map((document) => toDomain(document));
};