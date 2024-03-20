import { useEffect, useState } from 'react';
import { isAuthenticated } from '@repo/switch-api/authentication';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableFooter,
  TablePagination,
  TableRow,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { ProcessingState } from './processing-states.ts';
import { useTranslation } from 'react-i18next';
import {
  acceptRegistration,
  getRegistrations,
  Registration,
  rejectRegistration,
} from '@repo/switch-api/registrations';
import { MainPageErrors } from './main-page-errors.ts';

import './main-page.scss';
import RegistrationRow from '../../components/registration-row/RegistrationRow.tsx';
import { sanitize } from '../../utils/string-sanitizer.ts';

export default function MainPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showAcceptModal, setShowAcceptModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const [focusedId, setFocusedId] = useState<string | undefined>(undefined);
  const [focusedName, setFocusedName] = useState<string | undefined>(undefined);

  const [reasonError, setReasonError] = useState<MainPageErrors | undefined>(
    undefined,
  );
  const [reason, setReason] = useState<string | undefined>(undefined);

  const [generalError, setGeneralError] = useState<boolean>(false);

  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const [processingStateFilter, setProcessingStateFilter] =
    useState<ProcessingState>(ProcessingState.ALL);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!(await isAuthenticated())) {
        return navigate('/auth');
      }
    };

    checkAuthentication();
  }, [navigate]);

  const processingStateFilterChange = (event: SelectChangeEvent) => {
    setProcessingStateFilter(event.target.value as ProcessingState);
  };

  const onPageChanged = async (page: number) => {
    setShowSpinner(true);
    const response = await getRegistrations(
      processingStateFilter,
      page * rowsPerPage,
      rowsPerPage,
    );
    if (!response?.ok) {
      setGeneralError(true);
    }
    setRegistrations(response?.registrations ?? []);
    setTotalCount(response?.count ?? 0);
    setCurrentPage(page);
    setShowSpinner(false);
  };

  const accept = async (id: string, fullName: string) => {
    setShowAcceptModal(true);
    setFocusedId(id);
    setFocusedName(fullName);
  };

  const acceptConfirmed = async (id: string) => {
    setShowSpinner(true);
    await acceptRegistration(id).then((ok) => {
      onPageChanged(currentPage);
      if (ok) {
        setGeneralError(!ok);
      }
    });
    setShowAcceptModal(false);
    setFocusedId(undefined);
    setFocusedName(undefined);
    setShowSpinner(false);
  };

  const reject = async (id: string, fullName: string) => {
    setShowRejectModal(true);
    setFocusedId(id);
    setFocusedName(fullName);
  };

  const rejectConfirmed = async (id: string, reason: string | undefined) => {
    setShowSpinner(true);
    if (reason) {
      await rejectRegistration(id, reason).then((ok) => {
        onPageChanged(currentPage);
        if (ok) {
          setGeneralError(!ok);
        }
      });
      setShowRejectModal(false);
      setFocusedId(undefined);
      setFocusedName(undefined);
      setReasonError(undefined);
      setReason(undefined);
    } else {
      setReasonError(MainPageErrors.REASON_MISSING);
    }
    setShowSpinner(false);
  };

  return (
    <Container sx={{ textAlign: 'left', width: '100vw' }}>
      <Box
        sx={{
          width: '100%',
          height: 'auto',
          mt: 10,
          display: 'flex',
          alignContent: 'center',
        }}
      >
        <Button
          className="search_button"
          onClick={() => onPageChanged(0)}
          title="search-button"
        >
          {t('main-page.filter.search')}
        </Button>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="processingState-filter-label">
            {t('main-page.filter.processing-state')}
          </InputLabel>
          <Select
            title="processingState-filter"
            labelId="processingState-filter-label"
            id="processingState-filte"
            value={processingStateFilter}
            onChange={processingStateFilterChange}
            label={t('main-page.filter.processing-state')}
            sx={{ width: { sm: '100%', md: '50%', lg: '30%' } }}
          >
            <MenuItem
              value={ProcessingState.ALL}
              title="processingState-filter-all"
            >
              {t('main-page.filter.processing-states.all')}
            </MenuItem>
            <MenuItem
              value={ProcessingState.OPEN}
              title="processingState-filter-open"
            >
              {t('main-page.filter.processing-states.open')}
            </MenuItem>
            <MenuItem
              value={ProcessingState.ACCEPTED}
              title="processingState-filter-accepted"
            >
              {t('main-page.filter.processing-states.accepted')}
            </MenuItem>
            <MenuItem
              value={ProcessingState.REJECTED}
              title="processingState-filter-rejected"
            >
              {t('main-page.filter.processing-states.rejected')}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 'auto',
          mt: 5,
          display: 'flex',
          alignContent: 'center',
        }}
      >
        {registrations.length > 0 && (
          <Table title="result-table">
            <TableBody>
              {registrations.map((registration) => (
                <RegistrationRow
                  key={registration.id}
                  registration={registration}
                  accept={accept}
                  reject={reject}
                />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={totalCount}
                  page={currentPage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                  }}
                  onPageChange={(_event, page) => onPageChanged(page)}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
        {registrations.length === 0 && (
          <Typography sx={{ color: '#555' }} title="no-result-text">
            {t('main-page.no-results')}
          </Typography>
        )}
      </Box>
      <Modal
        open={showAcceptModal}
        onClose={() => {
          setShowAcceptModal(false);
          setFocusedId(undefined);
          setFocusedName(undefined);
        }}
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            bgcolor: '#fcfcfc',
            borderRadius: '15px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <div>{t('main-page.accept.info-text', { focusedName })}</div>
          <div className="modal_button-container">
            <span>
              <Button
                title="accept-action-button"
                variant={'contained'}
                onClick={() => acceptConfirmed(focusedId || '')}
              >
                {t('main-page.button.confirm')}
              </Button>
            </span>
            <span>
              <Button
                title="cancel-action-button"
                variant={'outlined'}
                onClick={() => {
                  setShowAcceptModal(false);
                  setFocusedId(undefined);
                  setFocusedName(undefined);
                }}
              >
                {t('main-page.button.cancel')}
              </Button>
            </span>
          </div>
        </Box>
      </Modal>
      <Modal
        open={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setFocusedId(undefined);
          setFocusedName(undefined);
          setReasonError(undefined);
        }}
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            bgcolor: '#fcfcfc',
            borderRadius: '15px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <div>{t('main-page.reject.info-text', { focusedName })}</div>
          <div>
            <TextField
              multiline
              margin="normal"
              required
              fullWidth
              id="reason"
              title="reason"
              label={t('main-page.reject.reason')}
              name="reason"
              error={!!reasonError}
              helperText={reasonError && t(`main-page.error.${reasonError}`)}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="modal_button-container">
              <span>
                <Button
                  title="accept-action-button"
                  variant={'contained'}
                  onClick={() =>
                    rejectConfirmed(focusedId || '', sanitize(reason ?? ''))
                  }
                >
                  {t('main-page.button.confirm')}
                </Button>
              </span>
              <span>
                <Button
                  title="cancel-action-button"
                  variant={'outlined'}
                  onClick={() => {
                    setShowRejectModal(false);
                    setFocusedId(undefined);
                    setFocusedName(undefined);
                    setReasonError(undefined);
                  }}
                >
                  {t('main-page.button.cancel')}
                </Button>
              </span>
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={generalError}
        autoHideDuration={3000}
        onClose={() => {
          setGeneralError(false);
        }}
      >
        <Alert
          onClose={() => {
            setGeneralError(false);
          }}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {t('main-page.error.action')}
        </Alert>
      </Snackbar>
      <Modal open={showSpinner}>
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
    </Container>
  );
}
