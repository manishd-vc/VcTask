import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography
} from '@mui/material';
import { DropDownArrow } from './icons';

export default function PredefineQuestion({
  title,
  predefineData,
  expanded,
  accordionHandler,
  handleQuestionToggle,
  values,
  setFieldValue
}) {
  const formatQuestionType = (type) => (type === 'radio' ? 'Radio Button' : 'Text Box');
  return (
    <Accordion expanded={expanded} onChange={accordionHandler}>
      <AccordionSummary expandIcon={<DropDownArrow />} sx={{ px: 0 }}>
        <Typography variant="subtitle5" color="primary.main" textTransform="uppercase">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <FormGroup sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', gap: 2 }}>
          {predefineData?.map((question, index) => (
            <FormControlLabel
              key={question?.queReference}
              control={
                <Checkbox
                  checked={values?.selectedQuestions?.includes(index)}
                  onChange={() => handleQuestionToggle(index, values?.selectedQuestions, setFieldValue)}
                />
              }
              label={
                <Typography component="div" variant="body1" color="text.secondarydark">
                  {question.questionText} &nbsp;
                  <Typography component="span" variant="subtitle1" mb={3}>
                    Answer Type: &nbsp;
                  </Typography>
                  {question.options?.length > 0 && (
                    <Typography component="span" variant="subtitle1">
                      {question?.options?.map((opt) => opt?.optionText).join(' / ')}&nbsp;
                    </Typography>
                  )}
                  <Typography component="span" variant="subtitle1" mb={3}>
                    {`(${formatQuestionType(question.questionType)})`}
                  </Typography>
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
