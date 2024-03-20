import { Collapse, TableCell, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ProcessingState } from '../../pages/main-page/processing-states.ts';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Registration } from '@repo/switch-api/registrations';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

type RegistrationRowProps = {
  registration: Registration;
  reject: any;
  accept: any;
};

export default function RegistrationRow({
  registration,
  accept,
  reject,
}: RegistrationRowProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <>
      <TableRow key={registration.id}>
        <TableCell sx={{ borderBottom: 'none' }}>
          <span>
            {registration.family.address.street}{' '}
            {registration.family.address.streetNo}
          </span>
          <br />
          <span>
            {registration.family.address.zip} {registration.family.address.city}
          </span>
          <br />
          <span>
            {registration.family.address.canton}{' '}
            {registration.family.address.bfsNo}
          </span>
          <br />
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <span>
            {registration.family.contactPerson.lastName}{' '}
            {registration.family.contactPerson.firstName},{' '}
            {t(
              `main-page.gender.${registration.family.contactPerson.gender.charAt(0)}`,
            )}
          </span>
          <br />
          <span>
            {t(
              `main-page.language.${registration.family.contactPerson.language}`,
            )}
          </span>
          <br />
          <span>{registration.family.contactPerson.email}</span>
          <br />
          <span>{registration.family.contactPerson.mobile}</span>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>
          <CheckIcon
            id="check-icon"
            sx={{
              fill:
                registration.state === ProcessingState.OPEN ? 'green' : 'gray',
              cursor:
                registration.state === ProcessingState.OPEN
                  ? 'pointer'
                  : 'not-allowed',
            }}
            onClick={() =>
              registration.state === ProcessingState.OPEN
                ? accept(
                    registration.id,
                    `${registration.family.contactPerson.firstName} ${registration.family.contactPerson.lastName}`,
                  )
                : {}
            }
          />
          <abbr
            title={
              registration.state === ProcessingState.REJECTED
                ? registration.reason
                : ''
            }
          >
            <CloseIcon
              id="cross-icon"
              sx={{
                fill:
                  registration.state === ProcessingState.OPEN ? 'red' : 'gray',
                cursor:
                  registration.state === ProcessingState.OPEN
                    ? 'pointer'
                    : 'not-allowed',
              }}
              onClick={() =>
                registration.state === ProcessingState.OPEN
                  ? reject(
                      registration.id,
                      `${registration.family.contactPerson.firstName} ${registration.family.contactPerson.lastName}`,
                    )
                  : {}
              }
            />
          </abbr>
          {expanded ? (
            <ExpandLessIcon
              sx={{ fill: '#1976d2', cursor: 'pointer' }}
              onClick={() => setExpanded(false)}
            />
          ) : (
            <ExpandMoreIcon
              onClick={() => setExpanded(true)}
              sx={{ fill: '#1976d2', cursor: 'pointer' }}
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {registration.family.partner.map((partner) => (
              <div key={partner.partnerId} className="collapse-container">
                <div className="collapse-item">
                  <span>
                    <strong>
                      {partner.lastName} {partner.firstName},{' '}
                      {t(`main-page.gender.${partner.gender.charAt(0)}`)}
                    </strong>
                  </span>
                  <br />
                  <span>{t(`main-page.language.${partner.language}`)}</span>
                  <br />
                  <span>
                    {partner.nationality}
                    {partner.residencePermit
                      ? `, ${partner.residencePermit}`
                      : ''}
                  </span>
                </div>
                <div className="collapse-item">
                  <span>
                    <strong>{t('main-page.table.previous-insurer')}</strong>
                  </span>
                  <br />
                  <span>
                    {partner.previousInsurer.name},{' '}
                    {partner.previousInsurer.fophId}
                  </span>
                  <br />
                </div>
                <div className="collapse-item">
                  <span>
                    <strong>{t('main-page.table.new-insurance')}</strong>
                  </span>
                  <br />
                  <span>
                    {partner.insuranceConfiguration.insurer.name},{' '}
                    {partner.insuranceConfiguration.insurer.fophId}
                  </span>
                  <br />
                  <span>
                    {t('main-page.table.franchise')}:{' '}
                    {partner.insuranceConfiguration.deductible}
                  </span>
                  <br />
                  <span>
                    {t('main-page.table.accident-coverage')}:
                    {partner.insuranceConfiguration.accidentCoverage
                      ? t('main-page.yes')
                      : t('main-page.no')}
                  </span>
                  <br />
                  <span>
                    {t('main-page.table.model')}:{' '}
                    {partner.insuranceConfiguration.rateName}
                  </span>
                  <br />
                  <span>
                    {partner.insuranceConfiguration.familyDoctorZsrNo
                      ? `${t('main-page.table.doctor-zsr')}: ${partner.insuranceConfiguration.familyDoctorZsrNo}`
                      : ''}
                  </span>
                  <br />
                </div>
              </div>
            ))}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
