import React, { FC, useState } from 'react';

import useTagsByCategory from 'hooks/useTagsByCategory';
import Checkboxes from './Checkboxes';

const TagSelector: FC = () => {
  const { spending: spendingTags } = useTagsByCategory();
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>(
    spendingTags,
  );
  return (
    <Checkboxes
      onChange={(newSelectedTags) => setSelectedTags(newSelectedTags)}
      options={spendingTags}
      selectedOptions={selectedTags || spendingTags}
    />
  );
};

export default TagSelector;
