import { faqs } from "../constants/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";

export function FAQs() {
  return (
    <div className="flex items-center justify-center w-full">
      <Accordion
        type="single"
        collapsible
        className="w-[672px]"
        defaultValue="item-1"
      >
        {faqs.map((faq, idx) => {
          return (
            <div key={idx}>
              <AccordionItem value={`${idx}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </div>
          );
        })}
      </Accordion>
    </div>
  );
}
