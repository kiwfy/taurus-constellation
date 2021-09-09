import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import download from 'downloadjs';
import ConfirmationModal from '../../../../components/modules/ConfirmationModal/ConfirmationModal';
import Default from '../../../../components/layouts/Default/Default';
import Dropdown from '../../../../components/elements/Dropdown/Dropdown';
import InfoCard from '../../../../components/modules/InfoCard/InfoCard';
import Loader from '../../../../components/elements/Loader/Loader';
import PageHeader from '../../../../components/modules/PageHeader/PageHeader';
import api from '../../../../services/api';
import { capitalize } from '../../../../utils/stringUtils';
import styles from './styles.module.scss';

interface JobsDetailParams {
  queueId: string;
  jobId: string;
}

interface JobStacktrace {
  order: number;
  content: string;
}

interface Job {
  id: string;
  name: string;
  data: any;
  dateTime: string;
  attemptsMade: number;
  state: string;
  failedReason?: string;
  stacktrace?: JobStacktrace[];
}

const JobsDetail: React.FC = () => {
  const history = useHistory();
  const { queueId, jobId } = useParams<JobsDetailParams>();
  const [job, setJob] = useState<Job>({} as Job);
  const [showRetryModal, setShowRetryModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Load job.
   */
  const loadJob = useCallback(async () => {
    const { data } = await api.get<Job>(`/queue/${queueId}/job/${jobId}`);
    setJob(data);
  }, [queueId, jobId]);

  useEffect(() => {
    setLoading(true);
    try {
      loadJob();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [queueId, jobId]);

  /**
   * Remove job.
   */
  const removeJob = useCallback(async () => {
    setLoading(true);
    try {
      await api.delete(`/queue/${queueId}/job`, {
        data: {
          jobIds: [jobId],
        },
      });
      setLoading(false);
      setShowRemoveModal(false);
      history.goBack();
    } catch (error) {
      setLoading(false);
    }
  }, [jobId]);

  /**
   * Retry job.
   */
  const retryJob = useCallback(async () => {
    setLoading(true);
    try {
      await api.post(`/queue/${queueId}/job/retry`, {
        jobIds: [jobId],
      });
      setLoading(false);
      setShowRemoveModal(false);
      history.goBack();
    } catch (error) {
      setLoading(false);
    }
  }, [jobId]);

  /**
   * Export job.
   */
  const exportJob = useCallback(async () => {
    setLoading(true);
    try {
      const filename = `queue_${queueId}-job_${jobId}.json`;
      const { data } = await api.get(`/queue/${queueId}/job/${jobId}/export`);
      download(
        JSON.stringify(data, null, 2),
        filename,
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [jobId]);

  /**
   * Get formatted job stacktrace.
   */
  const getFormattedStacktrace = useCallback(() => {
    if (!job.stacktrace) {
      return null;
    }

    return job.stacktrace.map((item) => (
      <div
        className={styles.stacktraceItem}
        key={item.order}
      >
        <pre>
          {item.content}
        </pre>
      </div>
    ));
  }, [jobId]);

  return (
    <Default>
      {
        loading
        && <Loader />
      }

      <ConfirmationModal
        title="Remove Job"
        show={showRemoveModal}
        onConfirm={removeJob}
        onCancel={() => { setShowRemoveModal(false); }}
      >
        Do you want to remove this job?
      </ConfirmationModal>

      <ConfirmationModal
        title="Retry Job"
        show={showRetryModal}
        onConfirm={retryJob}
        onCancel={() => { setShowRetryModal(false); }}
      >
        Do you want to retry this job?
      </ConfirmationModal>

      <PageHeader
        title="Job Details"
        tools={(
          <>
            <Dropdown
              title="Actions"
              options={[
                {
                  label: 'Retry',
                  onClick: () => { setShowRetryModal(true); },
                },
                {
                  label: 'divider-1',
                  isDivider: true,
                },
                {
                  label: 'Remove',
                  onClick: () => { setShowRemoveModal(true); },
                },
                {
                  label: 'divider-2',
                  isDivider: true,
                },
                {
                  label: 'Export',
                  onClick: () => { exportJob(); },
                },
              ]}
            />
          </>
        )}
      />

      <Container className="mb-2" fluid>
        <Row>
          <Col className="mb-2" md={3}>
            <InfoCard
              variant="success"
              label="Job Id"
              value={job.id}
            />
          </Col>
          <Col className="mb-2" md={3}>
            <InfoCard
              variant="success"
              label="State"
              value={job.state ? capitalize(job.state) : ''}
            />
          </Col>
          <Col className="mb-2" md={3}>
            <InfoCard
              variant="success"
              label="Created at"
              value={job.dateTime}
            />
          </Col>
          <Col className="mb-2" md={3}>
            <InfoCard
              variant="success"
              label="Attemtps made"
              value={job.attemptsMade}
            />
          </Col>
        </Row>

        <Row>
          <Col className="mb-2" md={12}>
            <InfoCard
              label="Data"
              variant="success"
              value={(
                <pre>
                  {job.data ? JSON.stringify(job.data, null, 2) : ''}
                </pre>
              )}
            />
          </Col>
        </Row>

        {
          ['failed', 'delayed'].includes(job.state) && (
            <Row>
              <Col className="mb-2" md={12}>
                <InfoCard
                  label="Reason for failure"
                  variant="danger"
                  value={(
                    <pre>
                      {job.failedReason}
                    </pre>
                  )}
                />
              </Col>
              <Col className="mb-2" md={12}>
                <InfoCard
                  label="Stacktraces"
                  variant="danger"
                  value={getFormattedStacktrace()}
                />
              </Col>
            </Row>
          )
        }
      </Container>
    </Default>
  );
};

export default JobsDetail;